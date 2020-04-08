import { Type, LoggerService, DynamicModule, ForwardReference, Provider } from "@nestjs/common";
import { GpsAdapterInterface } from "./adapter.interface";
import { DeviceAbstractFactory } from "../factory";

export interface GpsServerOptionsInterface {
    port: number;
    bind?: string;
    adapter?: Type<GpsAdapterInterface>;
    logger?: Type<LoggerService>;
    device_factory?: Type<DeviceAbstractFactory>;
    imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>,
    providers?: Provider[];
    useUDP?: boolean;
    useTCP?: boolean;
};