import {
    GpsAdapterInterface,
    GpsMessagePartsInterface,
    GpsGeoDataInterface,
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
    VEHICLE_STATE: 13,
    VEHICLE_DOOR: 14,
    OIL_TANK1: 15,
    OIL_TANK2: 16,
    TEMPERATURE: 17,
};

Object.freeze(MESSAGE_CODES);


const ALARM_TEXT_CODES = [
    "help me",                                  // SOS ALARM
    "low battery",                              // LOW BATTERY ALARM
    "move",                                     // MOVEMENT ALARM
    "speed",                                    // OVER SPEED ALARM
    "stockade",                                 // GEO-FENCE ALARM
    "ac alarm",                                 // POWER OFF ALARM
    "acc",                                      // ACC alarm
    "door alarm",                               // DOOR OPEN ALARM
    "sensor alarm",                             // SHOCK ALARM
    "acc alarm",                                // ACC ALARM
    "bonnet alarm",                             // BONNET ALARM (BUJíA)
    "footbrake alarm",                          // FOOTBRAKE ALARM
    "T:",                                       // TEMPERATURE ALARM
    "oil",                                      // OIL
    "DTC",                                      // Notification of Vehicle fault
    "service"                                   // Vehicle maintenance notification
];

const LOGIN_REGEX = /^##,imei:(?<IMEI>\d{15,16}),A;$/g;
const HEARTBEAT_REGEX = /^(?<IMEI>\d{15,16})$/g;
const DATA_REGEX = /^imei:(?<IMEI>\d{15,16}),(?<DATA>.+);$/g

export class GPS103 implements GpsAdapterInterface {
    device: AbstractGpsDevice;
    async get_alarm_data(message: GpsMessagePartsInterface): Promise<GpsGeoDataInterface> {
        const data = this.parse_message(message);
        if (message.cmd.startsWith("T:"))
            data.temperature = message.cmd.substring(message.cmd.indexOf("+") + 1);
        if (message.cmd.startsWith("oil "))
            data.oil_tank1 = message.cmd.substring(message.cmd.indexOf(" ") + 1);
        if (message.cmd == "DTC") {
            let DTC = { DTC: data.oil_tank2, oil_tank2: null };
            Object.assign(data, DTC);
            data.oil_tank2 = null;
        }
        if (message.cmd == "service") {
            let service = {
                service_maintenance_expiration: data.oil_tank2,
                service_maintenance_mileage: data.temperature,
                oil_tank2: null,
                temperature: null
            };
            Object.assign(data, service);
        }
        return {
            status: message.cmd,
            latitude: data['latitude'] ?? null,
            longitude: data['longitude'] ?? null,
            date: data['date'],
            custom: data
        };
    }
    async get_ping_data(message: GpsMessagePartsInterface): Promise<GpsGeoDataInterface> {
        const data = this.parse_message(message);
        let res: GpsGeoDataInterface = {
            latitude: data.latitude,
            longitude: data.longitude,
            date: data['datetime'],
            speed: data.speed,
            orientation: data.orientation,
            fixed: data.fixed,
            altitude: data.altitude,
            custom: {
                acc_state: data.acc_state,
                door_state: data.door_state,
                oil_tank: [data.oil_tank1, data.oil_tank2],
                temperature: data.temperature,
            }
        }
        return res;
    }
    async send_device_authorized(): Promise<void> {
        await this.send_raw("LOAD");
    }
    send_device_request_login(): Promise<void> {
        return;
    }
    async get_other_actions(parts: GpsMessagePartsInterface): Promise<GpsOtherActionsDataInterface> {
        switch (parts.cmd) {
            case 'heartbeat':
                this.send_raw("ON");
                break;
            case 'OBD':
                return {
                    custom: {
                        TIME: parts.data[1],
                        ACCUMULATIVE_MILEAGE: parts.data[2],
                        INSTANT_FUEL: parts.data[3],
                        AVG_FUEL: parts.data[4],
                        DRIVING_TIME: parts.data[5],
                        SPEED: parts.data[6],
                        POWER_LOAD: parts.data[7],
                        WATER_TEMPERATURE: parts.data[8],
                        THROTLE_PERCENTAGE: parts.data[9],
                        ENGINE_SPEED: parts.data[10],
                        BATTERY_VOLTAGE: parts.data[11],
                        DIAG_CODE1: parts.data[12],
                        DIAG_CODE2: parts.data[13],
                        DIAG_CODE3: parts.data[14],
                        DIAG_CODE4: parts.data[15],
                    }
                };
            case 'TPMS':
                // TODO: NOT IMPLEMENTED YET
                this.device.logger.debug(parts);
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
        let login_test = LOGIN_REGEX.exec(data);
        if (login_test) {
            let groups = login_test.groups;
            parts.device_id = groups['IMEI'];
            parts.cmd = "login_request";
            parts.action = GPS_MESSAGE_ACTION.LOGIN_REQUEST;
            parts.data = data;
            return parts;
        }

        let heartbeat_test = HEARTBEAT_REGEX.exec(data);

        if (heartbeat_test) {
            let groups = heartbeat_test.groups;
            parts.device_id = groups['IMEI'];
            if (this.device.loged && this.device.getUID() != parts.device_id) throw `The logued device ID doesn't match the data ID[${parts.device_id}]`;
            parts.cmd = "heartbeat";
            parts.action = GPS_MESSAGE_ACTION.OTHER;
            return parts;
        }

        let data_test = DATA_REGEX.exec(data);
        if (!data_test)
            throw 'Incorrect protocol';

        let groups = data_test.groups;
        parts.device_id = groups['IMEI'];
        if (this.device.loged && this.device.getUID() != parts.device_id) throw `The logued device ID doesn't match the data ID[${parts.device_id}]`;
        var content = groups['DATA'];
        var parsed_content = content.split(',');
        parts.cmd = parsed_content[0] ?? null;
        parts.data = parsed_content;

        switch (parts.cmd) {
            case "001":
                parts.action = GPS_MESSAGE_ACTION.PING;
                break;
            case null:
                throw 'Incorrect protocol';
            default:
                if (ALARM_TEXT_CODES.includes(parts.cmd) || ALARM_TEXT_CODES.find(txt_code => parts.cmd.startsWith(txt_code)))
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
            "oil_tank1": data_parts[MESSAGE_CODES.OIL_TANK1],
            "oil_tank2": data_parts[MESSAGE_CODES.OIL_TANK2],
            "temperature": data_parts[MESSAGE_CODES.TEMPERATURE]
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