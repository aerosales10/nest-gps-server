import {
    GpsAdapterInterface,
    GpsMessagePartsInterface,
    GpsGeoDataInterface,
    GpsOtherActionsDataInterface,
    GPS_MESSAGE_ACTION
} from '../interface';
import { AbstractGpsDevice } from '../models';

export class Echo implements GpsAdapterInterface {
    device: AbstractGpsDevice;

    async parse_data(data: string | Buffer): Promise<GpsMessagePartsInterface[]> {
        let str_data = data.toString().trim();
        let response = {
            action: GPS_MESSAGE_ACTION.PING,
            cmd: "Echo",
            data: str_data,
            device_id: `${this.device.ip}-${this.device.port}`
        };

        if (str_data == "login")
            response.action = GPS_MESSAGE_ACTION.LOGIN_REQUEST;

        return [response, response];
    }
    async get_alarm_data(message: GpsMessagePartsInterface): Promise<GpsGeoDataInterface> {
        return {
            status: 'alarm',
            date: new Date(),
            latitude: 0,
            longitude: 0,
            custom: message.data
        };
    }
    async get_ping_data(message: GpsMessagePartsInterface): Promise<GpsGeoDataInterface> {
        this.device.send(`${JSON.stringify(message)}\r\n`);
        return {
            date: new Date(),
            latitude: 0,
            longitude: 0,
            custom: message.data
        };
    }
    async send_device_authorized(): Promise<void> {
        await this.device.send("Echo loged\r\n");
        return;
    }
    async send_device_request_login(): Promise<void> {
        await this.device.send("Please you must login using the login word\r\n");
        return;
    }
    async get_other_actions(parts: GpsMessagePartsInterface): Promise<GpsOtherActionsDataInterface> {
        return {
            custom: parts.data
        };
    }
    async request_logout(): Promise<boolean> {
        await this.device.send("Please logout\r\n");
        return true;
    }
    async set_refresh_time(interval: number): Promise<boolean> {
        return true;
    }

    async login_request(uid: string, message: GpsMessagePartsInterface): Promise<boolean> {
        return true;
    }
}