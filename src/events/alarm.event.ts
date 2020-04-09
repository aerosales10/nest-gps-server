import { GpsMessagePartsInterface, GpsGeoDataInterface } from "../interface";

export interface GpsAlarmEvent {
    uid: string;
    data: GpsGeoDataInterface;
    message: GpsMessagePartsInterface;
}