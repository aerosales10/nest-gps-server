
export enum GPS_MESSAGE_ACTION { LOGIN_REQUEST, PING, ALARM, OTHER }
export interface GpsMessagePartsInterface {
    action: GPS_MESSAGE_ACTION;
    device_id: string;
    data: Object;
    cmd: string;
    custom?: Object;
}