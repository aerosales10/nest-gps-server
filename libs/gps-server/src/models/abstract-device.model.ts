import { GpsDeviceInterface, GpsAdapterInterface, GPS_MESSAGE_ACTION, GpsMessagePartsInterface } from "../interface";
import { Socket } from "net";
import { EventEmitter } from "events";
import { LoggerService, Logger } from '@nestjs/common';

export abstract class AbstractGpsDevice extends EventEmitter implements GpsDeviceInterface {
    uid: string;
    socket: Socket;
    adapter: GpsAdapterInterface;
    ip: string;
    port: number;
    name: string;
    loged: boolean;
    logger: LoggerService;

    constructor(adapter: GpsAdapterInterface, socket: Socket, logger?: LoggerService) {
        super({ captureRejections: true });
        this.adapter = adapter;
        this.socket = socket;
        this.ip = socket.remoteAddress;
        this.port = socket.remotePort;
        this.on('data', this.handle_data);
        this.logger = logger || Logger;
    }

    getUID(): string {
        return this.uid;
    }
    
    async abstract handle_action(action: GPS_MESSAGE_ACTION, message_parts: GpsMessagePartsInterface): Promise<void>;
    async abstract handle_data(data: Buffer | string): Promise<void>;
    async abstract login(can_login: boolean): Promise<void>;
    async abstract logout(): Promise<void>;
    async abstract set_refresh_time(interval: number): Promise<boolean>;
}