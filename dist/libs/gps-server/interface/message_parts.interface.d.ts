export declare enum GPS_MESSAGE_ACTION {
    LOGIN_REQUEST = 0,
    PING = 1,
    ALARM = 2,
    OTHER = 3
}
export interface GpsMessagePartsInterface {
    action: GPS_MESSAGE_ACTION;
    device_id: string;
    data: Object;
    cmd: string;
}
