import { GpsMessagePartsInterface, GpsGeoDataInterface } from "../interface";

export interface GpsPingEvent {
    uid: string;
    data: GpsGeoDataInterface;
    message: GpsMessagePartsInterface;
}