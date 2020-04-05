import { GpsAdapterInterface } from '../interface';
export class GPS103 implements GpsAdapterInterface {
    parse_data(data: string | Uint8Array): Promise<import("../interface").GpsMessagePartsInterface> {
        throw new Error("Method not implemented.");
    }
    get_alarm_data(message: import("../interface").GpsMessagePartsInterface): Promise<import("../interface").GpsAlarmDataInterface> {
        throw new Error("Method not implemented.");
    }
    get_ping_data(message: import("../interface").GpsMessagePartsInterface): Promise<import("../interface").GpsPingDataInterface> {
        throw new Error("Method not implemented.");
    }
    authorize(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    request_login(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    get_other_actions(parts: import("../interface").GpsMessagePartsInterface): Promise<import("../interface").GpsOtherActionsDataInterface> {
        throw new Error("Method not implemented.");
    }
    request_logout(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    set_refresh_time(interval: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}