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
    /**
     * Send data to device responding to a correct authorization
     */
    send_device_authorized(): Promise<void>;
    /**
     * Request the device to login to go further
     */
    send_device_request_login(): Promise<void>;
    get_other_actions(parts: GpsMessagePartsInterface): Promise<GpsOtherActionsDataInterface>;
    request_logout(): Promise<boolean>;
    set_refresh_time(interval: number): Promise<boolean>;

    /**
     * This function executes when the device is trying to login
     * @param uid Device uid
     * @param message The message being passed
     */
    login_request(uid: string, message: GpsMessagePartsInterface): Promise<boolean>;
};