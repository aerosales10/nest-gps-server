import { GpsMessagePartsInterface, GpsAlarmDataInterface } from "../interface";
export interface GpsAlarmEvent {
    uid: string;
    alarm_data: GpsAlarmDataInterface;
    message: GpsMessagePartsInterface;
}
