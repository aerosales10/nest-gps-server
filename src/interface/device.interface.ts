import { Socket as TCPSocket } from "net";
import { GpsAdapterInterface } from "./adapter.interface";
import { GPS_MESSAGE_ACTION, GpsMessagePartsInterface } from "./message_parts.interface";
import { Socket as UDPSocket } from "dgram";

export interface GpsDeviceInterface {
    uid: string;
    socket: TCPSocket | UDPSocket;
    adapter: GpsAdapterInterface;
    ip: string;
    port: number;
    name: string;
    loged: boolean;
    custom: Object;

    getUID(): string;
    handle_data(data: Buffer | string): Promise<void>;
    handle_action(action: GPS_MESSAGE_ACTION, message_parts: GpsMessagePartsInterface): Promise<void>;
    login(can_login: boolean): Promise<void>;
    logout(): Promise<void>;
    set_refresh_time(interval: number): Promise<boolean>;
    send(msg: Uint8Array | string): Promise<boolean>;
};