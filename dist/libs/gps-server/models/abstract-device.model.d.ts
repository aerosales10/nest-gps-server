/// <reference types="node" />
import { GpsDeviceInterface, GpsAdapterInterface, GPS_MESSAGE_ACTION, GpsMessagePartsInterface } from "../interface";
import { Socket } from "net";
import { EventEmitter } from "events";
import { LoggerService } from '@nestjs/common';
export declare abstract class AbstractGpsDevice extends EventEmitter implements GpsDeviceInterface {
    uid: string;
    socket: Socket;
    adapter: GpsAdapterInterface;
    ip: string;
    port: number;
    name: string;
    loged: boolean;
    logger: LoggerService;
    constructor(adapter: GpsAdapterInterface, socket: Socket, logger?: LoggerService);
    getUID(): string;
    handle_data(data: Buffer | string): Promise<void>;
    abstract handle_action(action: GPS_MESSAGE_ACTION, message_parts: GpsMessagePartsInterface): Promise<void>;
    abstract login(can_login: boolean): Promise<void>;
    abstract logout(): Promise<void>;
    abstract set_refresh_time(interval: number): Promise<boolean>;
    abstract send(msg: Uint8Array | string): Promise<boolean>;
}
