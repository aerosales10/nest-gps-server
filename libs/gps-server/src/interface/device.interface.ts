import { Socket} from "net";
import { GpsAdapterInterface } from "./adapter.interface";
import { GPS_MESSAGE_ACTION, GpsMessagePartsInterface } from "./message_parts.interface";

export interface GpsDeviceInterface {
    uid: string;
    socket: Socket;
    adapter: GpsAdapterInterface;
    ip: string;
    port: number;
    name: string;
    loged: boolean;

    getUID(): string;
    handle_data(data: Uint8Array | string): Promise<void>;
    handle_action(action: GPS_MESSAGE_ACTION, message_parts: GpsMessagePartsInterface): Promise<void>;
};