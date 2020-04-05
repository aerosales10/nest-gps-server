import { GpsAdapterInterface, GPS_MESSAGE_ACTION, GpsMessagePartsInterface } from "../interface";
import { Socket } from "net";
import { LoggerService, Logger } from '@nestjs/common';
import { GpsLoginRequestEvent, GpsLoginFailEvent, GpsPingEvent, GpsAlarmEvent } from "../events";
import { AbstractGpsDevice } from "./abstract-device.model";

export class GpsDevice extends AbstractGpsDevice {
    uid: string;
    socket: Socket;
    adapter: GpsAdapterInterface;
    ip: string;
    port: number;
    name: string;
    loged: boolean;
    logger: LoggerService;

    constructor(adapter: GpsAdapterInterface, socket: Socket, logger?: LoggerService) {
        super(adapter, socket, logger);
    }

    getUID(): string {
        return this.uid;
    }

    async handle_action(action: GPS_MESSAGE_ACTION, message_parts: GpsMessagePartsInterface): Promise<void> {
        if (action != GPS_MESSAGE_ACTION.LOGIN_REQUEST && !this.loged) {
            await this.adapter.send_device_request_login();
            this.logger.debug(`${this.getUID()} is trying to ${GPS_MESSAGE_ACTION[action]} but isn't logged. Action wasn't executed.`);
            return;
        }

        switch (action) {
            case GPS_MESSAGE_ACTION.LOGIN_REQUEST:
                await this.handle_login_request(message_parts);
                break;
            case GPS_MESSAGE_ACTION.PING:
                await this.handle_ping_action(message_parts);
                break;
            case GPS_MESSAGE_ACTION.ALARM:
                await this.handle_alarm_action(message_parts);
                break;
            case GPS_MESSAGE_ACTION.OTHER:
                this.handle_other_request(message_parts);
                break;
            default:
                this.logger.debug(`The action wasn't correct`);
                return;
        }
    }

    async handle_login_request(message_parts: GpsMessagePartsInterface): Promise<boolean> {
        let can_login = await this.adapter.login_request(this.getUID(), message_parts);
        this.login(can_login);
        const login_event: GpsLoginRequestEvent = { uid: this.getUID(), message: message_parts, ip: this.ip };
        return this.emit('login_request', login_event);
    }

    async handle_other_request(message_parts: GpsMessagePartsInterface): Promise<boolean> {
        const response = this.adapter.get_other_actions(message_parts);
        return this.emit('other_request', response);
    }

    async login(can_login: boolean): Promise<void> {
        if (!can_login) {
            this.logger.warn(`Device ${this.getUID()} not authorized. Login request was rejected. IP ${this.ip}`);
            const login_fail_event: GpsLoginFailEvent = { uid: this.getUID(), ip: this.ip };
            this.emit('login_fail', login_fail_event);
            return;
        }
        this.loged = true;
        await this.adapter.send_device_authorized();
        this.logger.debug(`Device ${this.getUID()} has been authorized.`);
    }

    async logout(): Promise<void> {
        this.loged = false;
        await this.adapter.request_logout();
    }

    async handle_ping_action(message_parts: GpsMessagePartsInterface): Promise<boolean> {
        const gps_data = await this.adapter.get_ping_data(message_parts);
        if (!gps_data) {
            this.logger.debug(`GPS data can't be parsed. Discarding the packet.`);
            return false;
        }

        this.logger.debug(`Position received ( ${gps_data.latitude}, ${gps_data.longitude} ) ${gps_data.date}`);
        const ping_event: GpsPingEvent = { uid: this.getUID(), gps_data: gps_data, message: message_parts };
        return this.emit('ping', ping_event);
    }

    async handle_alarm_action(message_parts: GpsMessagePartsInterface): Promise<boolean> {
        const alarm_data = await this.adapter.get_alarm_data(message_parts);
        if (!alarm_data) {
            this.logger.debug(`Alarm data can't be parsed. Discarding the packet.`);
            return false;
        }

        this.logger.debug(`Alarm received ( ${alarm_data.code}, ${alarm_data.msg} )`);
        const alarm_event: GpsAlarmEvent = { uid: this.getUID(), alarm_data: alarm_data, message: message_parts };
        return this.emit('alarm', alarm_event);
    }

    async set_refresh_time(interval: number): Promise<boolean> {
        return this.adapter.set_refresh_time(interval);
    }

    async send(msg: Uint8Array | string): Promise<boolean> {
        return this.socket.write(msg);
    };
}