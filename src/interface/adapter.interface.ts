import { GpsMessagePartsInterface } from "./message_parts.interface";
import { GpsGeoDataInterface } from "./gps-geo-data.interface";
import { GpsOtherActionsDataInterface } from "./other-actions-data.interface";
import { AbstractGpsDevice } from "../models";

export interface GpsAdapterInterface {

    device: AbstractGpsDevice;

    parse_data(data: Buffer | string): Promise<GpsMessagePartsInterface | GpsMessagePartsInterface[]>;
    get_alarm_data(message: GpsMessagePartsInterface): Promise<GpsGeoDataInterface>;
    get_ping_data(message: GpsMessagePartsInterface): Promise<GpsGeoDataInterface>;
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
     * This function executes when the device is trying to login.
     * Return true to authenticate the device.
     * @param uid Device uid
     * @param message The message being passed
     */
    login_request(uid: string, message: GpsMessagePartsInterface): Promise<boolean>;
};