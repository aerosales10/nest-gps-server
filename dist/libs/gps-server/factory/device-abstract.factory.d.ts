/// <reference types="node" />
import { GpsAdapterInterface } from '../interface';
import { Socket } from 'net';
import { LoggerService } from '@nestjs/common';
import { AbstractGpsDevice } from '../models';
export declare abstract class DeviceAbstractFactory {
    protected adapter: GpsAdapterInterface;
    protected logger: LoggerService;
    constructor(adapter: GpsAdapterInterface, logger: LoggerService);
    abstract create(socket: Socket): AbstractGpsDevice;
}
