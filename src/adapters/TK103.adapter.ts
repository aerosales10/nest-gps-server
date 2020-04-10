import {
    GpsAdapterInterface,
    GpsMessagePartsInterface,
    GpsGeoDataInterface,
    GpsOtherActionsDataInterface,
    GPS_MESSAGE_ACTION,
} from '../interface';

import * as functions from '../helpers';
import { AbstractGpsDevice } from '../models';
import { Injectable } from '@nestjs/common';

const format = { "start": "(", "end": ")", "separator": "" };
const MESSAGE_REGEX = /^\((?<DATE>\d{12})(?<CMD>\w{4})(?<DATA>.{0,1024})\)$/;
const LOGIN_REGEX = /^(?<ID>\d{15})(?<GPS>.*)$/;
const GPS_REGEX = /^(?<DATE>\d{6})(?<AVAILABILITY>A|V)(?<LATITUDE>(\d|\.){9})(?<LAT_INDICATOR>N|S)(?<LONGITUDE>(\d|\.){10})(?<LON_INDICATOR>E|W)(?<SPEED>(\d|\.){5})(?<TIME>\d{6})(?<ORIENTATION>(\d|\.){6})(?<IO_STATE>\d{8})(?<MILEPOST>\w{1})(?<MILE_DATA>\w{8})$/

const ALARM_TEXT_CODES = [
    "ac alarm",                                 // POWER OFF ALARM
    "acc alarm",                                // ACC ALARM
    "help me",                                  // SOS ALARM
    "door alarm",                               // DOOR OPEN ALARM
    "speed",                                    // OVER SPEED ALARM
    "speed",                                    // OVER SPEED ALARM
    "stockade"                                  // GEO-FENCE ALARM
];

@Injectable()
export class TK103 implements GpsAdapterInterface {
    device: AbstractGpsDevice;

    async parse_data(data: string | Buffer): Promise<GpsMessagePartsInterface> {

        data = data.toString().trim();

        let message_test = MESSAGE_REGEX.exec(data);

        if (!message_test)
            throw 'Incorrect protocol';

        let message_groups = message_test.groups;

        let parts: GpsMessagePartsInterface = {
            device_id: this.device.getUID(),
            cmd: message_groups["CMD"],
            data: message_groups["DATA"],
            action: null,
            custom: message_groups["DATE"]
        };

        this.device.custom = message_groups['DATE'];

        switch (parts.cmd) {
            case "BP05":
                parts.action = GPS_MESSAGE_ACTION.LOGIN_REQUEST;
                let login_request = LOGIN_REGEX.exec(parts.data.toString());
                if (!login_request)
                    throw "Invalid login request";
                let login_groups = login_request.groups;
                parts.device_id = login_groups['ID'];
                break;
            case "BR00":
                parts.action = GPS_MESSAGE_ACTION.PING;
                break;
            case "BO01":
                parts.action = GPS_MESSAGE_ACTION.ALARM;
                break;
            default:
                parts.action = GPS_MESSAGE_ACTION.OTHER;
                break;
        }

        return parts;
    }
    async get_alarm_data(message: GpsMessagePartsInterface): Promise<GpsGeoDataInterface> {
        //@TODO: implement this

        //Maybe we can save the gps data too.
        //gps_data = msg_parts.data.substr(1);
        const alarm_code = +message.data.toString().substr(0, 1);
        if (alarm_code < 0)
            return null;
        const str_gps_data = message.data.toString().substr(1);
        let gps_data: GpsGeoDataInterface = this.getGPSData(str_gps_data);

        if (alarm_code > ALARM_TEXT_CODES.length && alarm_code >= 0)
            gps_data.status = "alarm";
        else
            gps_data.status = ALARM_TEXT_CODES[alarm_code];

        await this.send_comand("AS01", alarm_code.toString());
        return gps_data;
    }
    async get_ping_data(message: GpsMessagePartsInterface): Promise<GpsGeoDataInterface> {
        let data = message.data.toString();
        return this.getGPSData(data);
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
                this.device.send(this.format_data(this.device.custom.toString() + "AP01HSO"));
                break;
        }
        return null;
    }
    request_logout(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async set_refresh_time(interval: number, duration: number = 0): Promise<boolean> {
        //XXXXYYZZ
        //XXXX Hex interval for each message in seconds
        //YYZZ Total time for feedback
        //YY Hex hours
        //ZZ Hex minutes
        var hours = duration / 3600;
        var minutes = (duration - hours * 3600) / 60;
        var time = interval.toString(16).padStart(4, "0") + hours.toString(16).padStart(2, "0") + minutes.toString(16).padStart(2, "0");
        return this.send_comand("AR00", time);
    }

    async login_request(uid: string, message: GpsMessagePartsInterface): Promise<boolean> {
        return true;
    }

    private getGPSData(gps_data: string): GpsGeoDataInterface {
        let gps_test = GPS_REGEX.exec(gps_data.trim());
        if (!gps_test) throw "The GPS data could not be parsed";
        let gps_groups = gps_test.groups;

        let str_datetime = "20" + gps_groups['DATE'].substr(0, 2) + "-" + gps_groups['DATE'].substr(2, 2) + "-" + gps_groups['DATE'].substr(4, 2);
        str_datetime += "T" + gps_groups['TIME'].substr(0, 2) + ":" + gps_groups['TIME'].substr(2, 2) + ":" + gps_groups['TIME'].substr(4, 2)
        let date_time = new Date(str_datetime);

        return {
            date: date_time,
            latitude: functions.minute_to_decimal(+gps_groups['LATITUDE'], gps_groups['LAT_INDICATOR']),
            longitude: functions.minute_to_decimal(+gps_groups['LONGITUDE'], gps_groups['LON_INDICATOR']),
            speed: +gps_groups['SPEED'],
            orientation: +gps_groups['ORIENTATION'],
            fixed: (gps_groups['AVAILABILITY'] == "A") ? true : false,
            custom: {
                acc_state: (+gps_groups["IO_STATE"]) ? true : false,
                miles: +gps_groups["MILE_DATA"]
            }
        };
    }

    private async send_comand(cmd: string, data: string = ""): Promise<boolean> {
        var msg = [this.device.custom.toString(), cmd, data];
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