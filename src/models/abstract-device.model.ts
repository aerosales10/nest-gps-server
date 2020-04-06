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
        this.adapter.device = this;
        this.socket.on('close', () => this.emit('disconnect', this.getUID()));
    }

    getUID(): string {
        return this.uid;
    }

    async handle_data(data: Buffer | string): Promise<void> {
        const parts = await this.adapter.parse_data(data);

        if (!parts) {
            this.logger.debug(`The message: ${data} can't be parsed. Discarding`);
            return;
        }

        if (!this.getUID() && !parts.device_id) {
            this.logger.debug(`The adapter doesn't return the device_id`);
            return;
        }

        if (!parts.cmd) {
            this.logger.debug(`The adapter doesn't return the command (cmd) property`);
            return;
        }

        this.uid = parts.device_id;
        await this.handle_action(parts.action, parts);
    }

    async abstract handle_action(action: GPS_MESSAGE_ACTION, message_parts: GpsMessagePartsInterface): Promise<void>;
    async abstract login(can_login: boolean): Promise<void>;
    async abstract logout(): Promise<void>;
    async abstract set_refresh_time(interval: number): Promise<boolean>;
    async abstract send(msg: Uint8Array | string): Promise<boolean>
}