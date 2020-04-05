import {
    GpsAdapterInterface,
    GpsMessagePartsInterface,
    GpsAlarmDataInterface,
    GpsPingDataInterface,
    GpsOtherActionsDataInterface,
    GPS_MESSAGE_ACTION,
    GpsDeviceInterface,
} from '../interface';

import * as functions from '../helpers';

const format = { "start": "(", "end": ")", "separator": "" };
export class TK103 implements GpsAdapterInterface {
    device: GpsDeviceInterface;
    async parse_data(data: string | Buffer): Promise<GpsMessagePartsInterface> {
        data = data.toString().trim();
        let cmd_start = data.indexOf("B");
        if (cmd_start > 13) throw "Device ID longuer than 12 chars!";
        let start = data.substr(0, 1);
        let finish = data.substr(data.length - 1, 1);
        let response: GpsMessagePartsInterface = {
            device_id: data.substr(1, cmd_start),
            cmd: data.substr(cmd_start, 4),
            data: data.substring(cmd_start + 4, data.length - 1),
            action: null
        };

        switch (response.cmd) {
            case "BP05":
                response.action = GPS_MESSAGE_ACTION.LOGIN_REQUEST
                break;
            case "BR00":
                response.action = GPS_MESSAGE_ACTION.PING;
                break;
            case "BO01":
                response.action = GPS_MESSAGE_ACTION.ALARM;
                break;
            default:
                response.action = GPS_MESSAGE_ACTION.OTHER;
                break;
        }

        return response;
    }
    async get_alarm_data(message: GpsMessagePartsInterface): Promise<GpsAlarmDataInterface> {
        //@TODO: implement this

        //Maybe we can save the gps data too.
        //gps_data = msg_parts.data.substr(1);
        const alarm_code = message.data.toString().substr(0, 1);
        let alarm = null;
        switch (alarm_code.toString()) {
            case "0":
                alarm = { "code": "power_off", "msg": "Vehicle Power Off" };
                break;
            case "1":
                alarm = { "code": "accident", "msg": "The vehicle suffers an acciden" };
                break;
            case "2":
                alarm = { "code": "sos", "msg": "Driver sends a S.O.S." };
                break;
            case "3":
                alarm = { "code": "alarming", "msg": "The alarm of the vehicle is activated" };
                break;
            case "4":
                alarm = { "code": "low_speed", "msg": "Vehicle is below the min speed setted" };
                break;
            case "5":
                alarm = { "code": "overspeed", "msg": "Vehicle is over the max speed setted" };
                break;
            case "6":
                alarm = { "code": "geo_fence", "msg": "Out of geo fence" };
                break;
            default:
                alarm = { "code": alarm_code, "msg": JSON.stringify(message.data) };
                break;
        }
        await this.send_comand("AS01", alarm_code.toString());
        return alarm;
    }
    async get_ping_data(message: GpsMessagePartsInterface): Promise<GpsPingDataInterface> {
        const str = message.data.toString().trim();
        var data = {
            "date": str.substr(0, 6),
            "availability": str.substr(6, 1),
            "latitude": functions.minute_to_decimal(parseFloat(str.substr(7, 9)), str.substr(16, 1)),
            "longitude": functions.minute_to_decimal(parseFloat(str.substr(17, 9)), str.substr(27, 1)),
            "speed": parseFloat(str.substr(28, 5)),
            "time": str.substr(33, 6),
            "orientation": str.substr(39, 6),
            "io_state": str.substr(45, 8),
            "mile_post": str.substr(53, 1),
            "mile_data": parseInt(str.substr(54, 8), 16)
        };
        var datetime = "20" + data.date.substr(0, 2) + "/" + data.date.substr(2, 2) + "/" + data.date.substr(4, 2);
        datetime += " " + data.time.substr(0, 2) + ":" + data.time.substr(2, 2) + ":" + data.time.substr(4, 2)
        data['datetime'] = new Date(datetime);
        let res: GpsPingDataInterface = {
            latitude: data.latitude,
            longitude: data.longitude,
            date: data['datetime'],
            speed: data.speed,
            orientation: data.orientation,
            custom: {
                mileage: data.mile_data
            }
        }
        return res;
    }
    async send_device_authorized(): Promise<void> {
        await this.send_comand("AP05");
    }
    send_device_request_login(): Promise<void> {
        //@TODO: Implement this.
        return;
    }
    get_other_actions(parts: GpsMessagePartsInterface): Promise<GpsOtherActionsDataInterface> {
        switch (parts.cmd) {
            case "BP00": //Handshake
                this.device.send(this.format_data(this.device.uid + "AP01HSO"));
                break;
        }
        return null;
    }
    request_logout(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async set_refresh_time(interval: number, duration: number = 3600): Promise<boolean> {
        //XXXXYYZZ
        //XXXX Hex interval for each message in seconds
        //YYZZ Total time for feedback
        //YY Hex hours
        //ZZ Hex minutes
        var hours = duration / 3600;
        var minutes = (duration - hours * 3600) / 60;
        var time = functions.str_pad(interval.toString(16), 4, '0') + functions.str_pad(hours.toString(16), 2, '0') + functions.str_pad(minutes.toString(16), 2, '0');
        return this.send_comand("AR00", time);
    }
    async login_request(uid: string, message: GpsMessagePartsInterface): Promise<boolean> {
        return true;
    }

    private async send_comand(cmd: string, data: string = ""): Promise<boolean> {
        var msg = [this.device.uid, cmd, data];
        return this.device.send(this.format_data(msg));
    }

    private format_data(params: string | Array<string>): string {
        /* FORMAT THE DATA TO BE SENT */
        var str = format.start;
        if (typeof (params) == "string") {
            str += params
        } else if (params instanceof Array) {
            str += params.join(format.separator);
        } else {
            throw "The parameters to send to the device has to be a string or an array";
        }
        str += format.end;
        return str;
    }

}