import { GpsDeviceInterface, GpsAdapterInterface, GPS_MESSAGE_ACTION, GpsMessagePartsInterface } from "../interface";
import { Socket as TCPSocket } from "net";
import { EventEmitter } from "events";
import { LoggerService, Logger } from '@nestjs/common';
import { Socket as UDPSocket } from "dgram";
import { setTimeout } from "timers";

export abstract class AbstractGpsDevice extends EventEmitter implements GpsDeviceInterface {
    uid: string;
    socket: TCPSocket | UDPSocket;
    adapter: GpsAdapterInterface;
    ip: string;
    port: number;
    name: string;
    loged: boolean;
    logger: LoggerService;
    trackInterval: number;
    custom: Object;
    protected dataTimehandlder: NodeJS.Timeout;
    protected timeoutCounter: number;
    

    constructor(adapter: GpsAdapterInterface, socket: TCPSocket | UDPSocket, logger?: LoggerService) {
        super({ captureRejections: true });
        this.adapter = adapter;
        this.socket = socket;
        this.ip = (socket instanceof TCPSocket) ? socket.remoteAddress : this.ip;
        this.port = (socket instanceof TCPSocket) ? socket.remotePort : this.port;
        this.logger = logger || Logger;
        this.adapter.device = this;
        this.socket.on('close', () => this.emit('disconnect', this.getUID()));
        this.timeoutCounter = 120 * 1000; // TWO MINUTES
        this.trackInterval = 30; // DEFAULTS TO 30s
        this.setTimeout();
        this.on('data', this.handle_data);
        this.on('error', err => this.logger.error(`[${this.getUID()}][${this.ip}:${this.port}]${err}`));
    }

    protected timeout() {
        this.emit('disconnect', this.getUID());
    }

    protected setTimeout(): AbstractGpsDevice {
        if (this.socket instanceof UDPSocket)
            this.dataTimehandlder = setTimeout(this.timeout.bind(this), this.timeoutCounter);
        return this;
    }

    protected clearTimeout(): AbstractGpsDevice {
        if (this.socket instanceof UDPSocket)
            clearTimeout(this.dataTimehandlder);
        return this;
    }

    getUID(): string {
        return this.uid;
    }

    async handle_data(data: Buffer | string): Promise<void> {
        this.clearTimeout().setTimeout();
        let parts = null;
        try { parts = await this.adapter.parse_data(data); } catch (err) { this.emit('error', err); return; }
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