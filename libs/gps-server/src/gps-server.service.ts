import { Injectable, Inject, OnApplicationBootstrap, OnApplicationShutdown, LoggerService } from '@nestjs/common';
import { Server, Socket, createServer } from 'net';
import { EventEmitter } from 'events';
import { GpsServerOptionsInterface, GpsAdapterInterface, GpsDeviceInterface } from './interface';
import * as Util from 'util';

@Injectable()
export class GpsServerService extends EventEmitter implements OnApplicationBootstrap, OnApplicationShutdown {
    protected server: Server;
    protected devices: Array<GpsDeviceInterface>;
    protected adapter: GpsAdapterInterface;
    protected options: GpsServerOptionsInterface;
    protected logger: LoggerService;

    constructor(
        @Inject('GPS_CONFIG_OPTIONS') options: GpsServerOptionsInterface,
        @Inject('GPS_ADAPTER') adapter: GpsAdapterInterface,
        logger: LoggerService
    ) {
        super({ captureRejections: true });
        this.adapter = adapter;
        this.options = options;
        this.logger = logger;
    }

    onServerInit(socket: Socket): void {

    }

    onApplicationShutdown(signal?: string) {
        this.server.removeAllListeners();
        this.server.close();
        delete this.devices;
    }

    onApplicationBootstrap() {
        this.server = createServer(this.onServerInit);
    }
}
