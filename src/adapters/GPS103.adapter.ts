import {
    GpsAdapterInterface,
    GpsMessagePartsInterface,
    GpsAlarmDataInterface,
    GpsPingDataInterface,
    GpsOtherActionsDataInterface,
    GPS_MESSAGE_ACTION

} from '../interface';

import { minute_to_decimal } from '../helpers';
import { AbstractGpsDevice } from '../models';

const MESSAGE_CODES = {
    KEYWORD: 0,
    DATE: 1,
    GPS_STATUS: 3,
    TIME: 4,
    LAT: 6,
    LAT_NS: 7,
    LON: 8,
    LON_EW: 9,
    SPEED: 10,
    DIRECTION: 11,
    ALTITUDE: 12,
    VEHICLE_STATE: 14,
    VEHICLE_DOOR: 15,
    OIL_TANK1: 16,
    OIL_TANK2: 17,
    TEMPERATURE: 18,
};

Object.freeze(MESSAGE_CODES);

const ALARM_INDEX_CODES = {

};

Object.freeze(ALARM_INDEX_CODES);

const ALARM_TEXT_CODES = [
    "help me",                                  // SOS ALARM
    "low battery",                              // LOW BATTERY ALARM
    "move",                                     // MOVEMENT ALARM
    "speed",                                    // OVER SPEED ALARM
    "stockade",                                 // GEO-FENCE ALARM
    "ac alarm",                                 // POWER OFF ALARM
    "door alarm",                               // DOOR OPEN ALARM
    "sensor alarm",                             // SHOCK ALARM
    "acc alarm",                                // ACC ALARM
    "bonnet alarm",                             // BONNET ALARM
    "footbrake alarm",                          // FOOTBRAKE ALARM
    "T:"                                        // TEMPERATURE ALARM
];

export class GPS103 implements GpsAdapterInterface {
    device: AbstractGpsDevice;
    async get_alarm_data(message: GpsMessagePartsInterface): Promise<GpsAlarmDataInterface> {
        const data = this.parse_message(message);
        return {
            code: data["keywords"],
            msg: null,
            custom: data
        };
    }
    async get_ping_data(message: GpsMessagePartsInterface): Promise<GpsPingDataInterface> {
        const data = this.parse_message(message);
        let res = {
            latitude: data.latitude,
            longitude: data.longitude,
            date: data['datetime'],
            speed: data.speed,
            orientation: data.orientation,
            fixed: data.fixed,
            altitude: data.altitude,
            acc_state: data.acc_state,
            door_state: data.door_state,
            oil_tank: [data.oil_tank1, data.oil_tank2],
            temperature: data.temperature
        }
        return res;
    }
    async send_device_authorized(): Promise<void> {
        await this.send_raw("LOAD");
    }
    send_device_request_login(): Promise<void> {
        return;
    }
    get_other_actions(parts: GpsMessagePartsInterface): Promise<GpsOtherActionsDataInterface> {
        switch (parts.cmd) {
            case 'heartbeat':
                this.send_raw("ON");
                break;
        }
        return null;
    }
    request_logout(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    set_refresh_time(interval: number): Promise<boolean> {
        return this.send_comand("001", [`${interval}s`]);
    }
    async login_request(uid: string, message: GpsMessagePartsInterface): Promise<boolean> {
        return true;
    }

    async parse_data(data: Buffer | string): Promise<GpsMessagePartsInterface> {
        data = data.toString().trim();

        let parts: GpsMessagePartsInterface = {
            device_id: null,
            cmd: null,
            data: null,
            action: null
            //optional parameters. Anything you want.
        };

        if (data.startsWith("##") && data.endsWith("A;")) {
            parts.device_id = data.substring(8, data.indexOf("A") - 1);
            parts.cmd = "login_request";
            parts.action = GPS_MESSAGE_ACTION.LOGIN_REQUEST;
            parts.data = data;
            return parts;
        }

        if (!data.startsWith("imei:") && !data.endsWith(";")) {
            if (data.length < 16 && data.length > 8) {
                parts.device_id = data;
                parts.cmd = "heartbeat";
                parts.action = GPS_MESSAGE_ACTION.OTHER;
                return parts;
            }
            throw 'Incorrect protocol';
        }

        if (data.length < 22)
            throw 'Incorrect protocol';

        parts.device_id = data.substring(5, 20);
        var content = data.substring(21, data.length - 1);
        var parsed_content = content.split(',');
        parts.cmd = (parsed_content.length > 0) ? parsed_content[0] : null;
        parts.data = parsed_content;

        switch (parts.cmd) {
            case "001":
                parts.action = GPS_MESSAGE_ACTION.PING;
                break;
            case null:
                throw 'Incorrect protocol';
            default:
                if (ALARM_TEXT_CODES.includes(parts.cmd))
                    parts.action = GPS_MESSAGE_ACTION.ALARM;
                else
                    parts.action = GPS_MESSAGE_ACTION.OTHER;
                break;
        }

        return parts;
    }



    /* INTERNAL FUNCTIONS */

    parse_message(message: GpsMessagePartsInterface): any {
        var data_parts = message.data;
        var data = {
            "keywords": data_parts[MESSAGE_CODES.KEYWORD],
            "date": data_parts[MESSAGE_CODES.DATE].substr(0, 6),
            "fixed": (data_parts[MESSAGE_CODES.GPS_STATUS] == "F") ? true : false,
            "latitude": minute_to_decimal(parseFloat(data_parts[MESSAGE_CODES.LAT]), data_parts[MESSAGE_CODES.LAT_NS]),
            "longitude": minute_to_decimal(parseFloat(data_parts[MESSAGE_CODES.LON]), data_parts[MESSAGE_CODES.LON_EW]),
            "speed": parseFloat(data_parts[MESSAGE_CODES.SPEED]),
            "time": data_parts[MESSAGE_CODES.TIME].substr(0, 6),
            "orientation": +data_parts[MESSAGE_CODES.DIRECTION],
            "altitude": +data_parts[MESSAGE_CODES.ALTITUDE],
            "acc_state": +data_parts[MESSAGE_CODES.VEHICLE_STATE],
            "door_state": +data_parts[MESSAGE_CODES.VEHICLE_DOOR],
            "oil_tank1": +data_parts[MESSAGE_CODES.OIL_TANK1],
            "oil_tank2": +data_parts[MESSAGE_CODES.OIL_TANK2],
            "temperature": +data_parts[MESSAGE_CODES.TEMPERATURE]
        };
        var datetime = "20" + data.date.substr(0, 2) + "/" + data.date.substr(2, 2) + "/" + data.date.substr(4, 2);
        datetime += " " + data.time.substr(0, 2) + ":" + data.time.substr(2, 2) + ":" + data.time.substr(4, 2) || "00";
        data['datetime'] = new Date(datetime);
        return data;
    }

    async send_comand(cmd: string, data: Array<string | number> = []): Promise<boolean> {
        return this.device.send(`**,imei:${this.device.uid},${cmd},${data.join(',')}`);
    }

    async send_raw(msg): Promise<boolean> {
        return this.device.send(msg);
    }
}