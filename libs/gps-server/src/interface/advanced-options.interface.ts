import { LoggerService, Type } from "@nestjs/common";
import { DeviceAbstractFactory } from "../factory";

export interface GpsAdvancedOptionsInterface {
    logger?: Type<LoggerService>;
    device_factory?: Type<DeviceAbstractFactory>;
};