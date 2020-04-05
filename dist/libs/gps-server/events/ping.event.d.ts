import { GpsMessagePartsInterface, GpsPingDataInterface } from "../interface";
export interface GpsPingEvent {
    uid: string;
    gps_data: GpsPingDataInterface;
    message: GpsMessagePartsInterface;
}
