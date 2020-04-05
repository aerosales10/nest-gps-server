import { GpsMessagePartsInterface } from "../interface";
export interface GpsLoginRequestEvent {
    uid: string;
    ip?: string;
    message: GpsMessagePartsInterface;
}
