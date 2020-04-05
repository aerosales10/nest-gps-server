import { GpsAdapterInterface, GpsMessagePartsInterface, GpsAlarmDataInterface, GpsPingDataInterface, GpsOtherActionsDataInterface, GPS_MESSAGE_ACTION, GpsDeviceInterface } from '../interface';
export class Echo implements GpsAdapterInterface {
    device: GpsDeviceInterface;

    async parse_data(data: string | Buffer): Promise<GpsMessagePartsInterface> {
        let str_data = data.toString().trim();
        let response = {
            action: GPS_MESSAGE_ACTION.PING,
            cmd: "Echo",
            data: str_data,
            device_id: "1234567890"
        };

        if (str_data == "login")
            response.action = GPS_MESSAGE_ACTION.LOGIN_REQUEST;

        return response;
    }
    async get_alarm_data(message: GpsMessagePartsInterface): Promise<GpsAlarmDataInterface> {
        return {
            code: "200",
            msg: "Hello there",
            custom: message.data
        };
    }
    async get_ping_data(message: GpsMessagePartsInterface): Promise<GpsPingDataInterface> {
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