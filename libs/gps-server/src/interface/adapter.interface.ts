import { GpsMessagePartsInterface } from "./message_parts.interface";
import { GpsAlarmDataInterface } from "./alarm-data.interface";
import { GpsPingDataInterface } from "./ping-data.interface";
import { GpsOtherActionsDataInterface } from "./other-actions-data.interface";

export interface GpsAdapterInterface {
    parse_data(data: Uint8Array | string): Promise<GpsMessagePartsInterface>;
    get_alarm_data(message: GpsMessagePartsInterface): Promise<GpsAlarmDataInterface>;
    get_ping_data(message: GpsMessagePartsInterface): Promise<GpsPingDataInterface>;
    authorize(): Promise<void>;
    request_login(): Promise<void>;
    get_other_actions(parts: GpsMessagePartsInterface): Promise<GpsOtherActionsDataInterface>;
    request_logout(): Promise<boolean>;
    set_refresh_time(interval: number): Promise<boolean>;
};