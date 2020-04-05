/// <reference types="node" />
import { GpsMessagePartsInterface } from "./message_parts.interface";
import { GpsAlarmDataInterface } from "./alarm-data.interface";
import { GpsPingDataInterface } from "./ping-data.interface";
import { GpsOtherActionsDataInterface } from "./other-actions-data.interface";
import { GpsDeviceInterface } from "./device.interface";
export interface GpsAdapterInterface {
    device: GpsDeviceInterface;
    parse_data(data: Buffer | string): Promise<GpsMessagePartsInterface>;
    get_alarm_data(message: GpsMessagePartsInterface): Promise<GpsAlarmDataInterface>;
    get_ping_data(message: GpsMessagePartsInterface): Promise<GpsPingDataInterface>;
    send_device_authorized(): Promise<void>;
    send_device_request_login(): Promise<void>;
    get_other_actions(parts: GpsMessagePartsInterface): Promise<GpsOtherActionsDataInterface>;
    request_logout(): Promise<boolean>;
    set_refresh_time(interval: number): Promise<boolean>;
    login_request(uid: string, message: GpsMessagePartsInterface): Promise<boolean>;
}
