import { Injectable, Inject, OnApplicationBootstrap, OnApplicationShutdown, LoggerService } from '@nestjs/common';
import { Server, Socket, createServer } from 'net';
import { EventEmitter } from 'events';
import { GpsServerOptionsInterface, GpsDeviceInterface } from './interface';
import { DeviceAbstractFactory } from './factory';

@Injectable()
export class GpsServerService extends EventEmitter implements OnApplicationBootstrap, OnApplicationShutdown {
    protected server: Server;
    protected devices: Array<GpsDeviceInterface>;
    protected options: GpsServerOptionsInterface;
    protected logger: LoggerService;
    protected factory: DeviceAbstractFactory;

    constructor(
        @Inject('GPS_CONFIG_OPTIONS') options: GpsServerOptionsInterface,
        factory: DeviceAbstractFactory,
        logger: LoggerService
    ) {
        super({ captureRejections: true });
        this.options = options;
        this.logger = logger;
        this.factory = factory;
    }

    onServerInit(socket: Socket): void {
        this.factory.create(socket);
    }

    onApplicationShutdown(signal?: string) {
        this.server.removeAllListeners();
        this.server.close();
        delete this.devices;
    }

    onApplicationBootstrap() {
        this.server = createServer(this.onServerInit).listen({
            host: this.options.bind,
            port: this.options.port
        });
    }
}
