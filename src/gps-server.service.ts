import { Injectable, Inject, OnApplicationBootstrap, OnApplicationShutdown, LoggerService } from '@nestjs/common';
import { Server, Socket, createServer } from 'net';
import { EventEmitter } from 'events';
import { GpsServerOptionsInterface } from './interface';
import { DeviceAbstractFactory } from './factory';
import { AbstractGpsDevice } from './models';

@Injectable()
export class GpsServerService extends EventEmitter implements OnApplicationBootstrap, OnApplicationShutdown {
    protected server: Server;
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

    async connection_handler(socket: Socket) {
        let self = this;
        self.logger.debug(`Incomming connection from ${socket.remoteAddress}:${socket.remotePort}`);
        const device = this.factory.create(socket);
        self.devices.push(device);

        socket.on('data', (data) => device.emit('data', data));
        socket.on('end', () => {
            let index = self.devices.findIndex((device: AbstractGpsDevice, index: number) => {
                if (device.socket.remoteAddress == socket.remoteAddress && device.socket.remotePort == socket.remotePort) {
                    self.devices.splice(index, 1);
                    return true;
                }
            });
            if (index < 0) return;
            self.logger.debug(`Device ${device.socket.remoteAddress}:${device.socket.remotePort} disconnected.`);
            device.emit('disconnected');
        });
    }

    onApplicationShutdown(signal?: string) {
        this.server.removeAllListeners();
        this.server.close();
        delete this.devices;
    }

    async onApplicationBootstrap() {
        this.server = createServer(this.connection_handler.bind(this)).listen({
            host: this.options.bind,
            port: this.options.port
        });
        this.logger.debug(`The server is listening on ${this.options.bind}:${this.options.port}`);
    }
}
