import { Injectable, Inject, OnApplicationBootstrap, OnApplicationShutdown, LoggerService } from '@nestjs/common';
import { EventEmitter } from 'events';
import { GpsServerOptionsInterface } from './interface';
import { DeviceAbstractFactory } from './factory';
import { AbstractGpsDevice } from './models';
import { Socket as UDPSocket, createSocket, RemoteInfo } from 'dgram';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class GpsUDPServerService extends EventEmitter implements OnApplicationBootstrap, OnApplicationShutdown {
    protected udp: UDPSocket;
    protected devices: Array<AbstractGpsDevice>;
    protected options: GpsServerOptionsInterface;
    protected logger: LoggerService;
    protected factory: DeviceAbstractFactory;

    constructor(
        @Inject('GPS_CONFIG_OPTIONS') options: GpsServerOptionsInterface,
        @Inject('GPS_DEVICE_FACTORY') factory: DeviceAbstractFactory,
        @Inject('GPS_LOGGER') logger: LoggerService
    ) {
        super({ captureRejections: true });
        this.options = options;
        this.options.bind = options.bind ?? '0.0.0.0';
        this.logger = logger;
        this.factory = factory;
        this.devices = [];
    }

    async connection_handler(data: Buffer, rinfo: RemoteInfo) {
        let device: AbstractGpsDevice = await from(this.devices)
            .pipe(first((pdevice => pdevice.ip == rinfo.address && pdevice.port == rinfo.port), null))
            .toPromise();

        if (device) {
            device.emit('data', data);
        }
        else {
            device = this.factory.create(this.udp);
            device.ip = rinfo.address;
            device.port = rinfo.port;
            this.devices.push(device);
            device.emit('data', data);
        }
        device.on('disconnect', async (uid) => {
            let fdevice = await from(this.devices)
                .pipe(first(((pdevice, index) => {
                    if (pdevice.getUID() === uid) {
                        this.devices.splice(index, 1);
                        return true;
                    }
                    return false;
                }), null))
                .toPromise();

            if (!fdevice) return;
            this.logger.debug(`Device ${fdevice.ip}:${fdevice.port} disconnected.`);
            device.emit('disconnected');
        });
    }

    onApplicationShutdown(signal?: string) {
        this.udp.removeAllListeners();
        this.udp.close();
        delete this.devices;
    }

    async onApplicationBootstrap() {
        this.on('error', this.onPromiseError.bind(this));
        this.udp = createSocket('udp4');
        this.udp.on('listening', () => this.logger.debug(`The UDP server is listening on ${this.options.bind}:${this.options.port}`));
        this.udp.on('message', this.connection_handler.bind(this));
        this.udp.bind(this.options.port, this.options.bind);
    }

    onPromiseError(error) {
        this.logger.error(error);
    }

}
