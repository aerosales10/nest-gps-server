/// <reference types="node" />
import { GpsAdapterInterface, GPS_MESSAGE_ACTION, GpsMessagePartsInterface } from "../interface";
import { Socket } from "net";
import { LoggerService } from '@nestjs/common';
import { AbstractGpsDevice } from "./abstract-device.model";
export declare class GpsDevice extends AbstractGpsDevice {
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
    handle_action(action: GPS_MESSAGE_ACTION, message_parts: GpsMessagePartsInterface): Promise<void>;
    handle_login_request(message_parts: GpsMessagePartsInterface): Promise<boolean>;
    handle_other_request(message_parts: GpsMessagePartsInterface): Promise<boolean>;
    login(can_login: boolean): Promise<void>;
    logout(): Promise<void>;
    handle_ping_action(message_parts: GpsMessagePartsInterface): Promise<boolean>;
    handle_alarm_action(message_parts: GpsMessagePartsInterface): Promise<boolean>;
    set_refresh_time(interval: number): Promise<boolean>;
    send(msg: Uint8Array | string): Promise<boolean>;
}
