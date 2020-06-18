import { Injectable, Inject, OnApplicationBootstrap, OnApplicationShutdown, LoggerService } from '@nestjs/common';
import { Server as TCPSERVER, Socket as TCPSocket, createServer } from 'net';
import { EventEmitter } from 'events';
import { GpsServerOptionsInterface } from './interface';
import { DeviceAbstractFactory } from './factory';
import { AbstractGpsDevice } from './models';


@Injectable()
export class GpsTCPServerService extends EventEmitter implements OnApplicationBootstrap, OnApplicationShutdown {
    protected tcp: TCPSERVER;
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

    async connection_handler(socket: TCPSocket) {
        let self = this;
        self.logger.debug(`Incomming connection from ${socket.remoteAddress}:${socket.remotePort}`);
        const device = this.factory.create(socket);
        self.devices.push(device);

        device.on('disconnect', (uid) => {
            let index = self.devices.findIndex((device: AbstractGpsDevice, index: number) => {
                if (device.getUID() === uid) {
                    self.devices.splice(index, 1);
                    return true;
                }
            });
            if (index < 0) return;
            self.logger.debug(`Device ${device.ip}:${device.port} disconnected.`);
            device.emit('disconnected');
        });

        setTimeout(() => {
            if (!device.loged) {
                socket.end();
            }
        }, 30000);
    }

    onApplicationShutdown(signal?: string) {
        this.tcp.removeAllListeners();
        this.tcp.close();
        delete this.devices;
    }

    async onApplicationBootstrap() {
        this.on('error', this.onPromiseError.bind(this));
        this.tcp = createServer(this.connection_handler.bind(this)).listen({
            host: this.options.bind,
            port: this.options.port
        });
        this.logger.debug(`The TCP server is listening on ${this.options.bind}:${this.options.port}`);
    }

    onPromiseError(error) {
        this.logger.error(error);
    }
}
