/// <reference types="node" />
import { GpsAdapterInterface } from '../interface';
import { Socket } from 'net';
import { LoggerService } from '@nestjs/common';
import { DeviceAbstractFactory } from './device-abstract.factory';
import { AbstractGpsDevice } from '../models';
export declare class DeviceFactory extends DeviceAbstractFactory {
    constructor(adapter: GpsAdapterInterface, logger: LoggerService);
    create(socket: Socket): AbstractGpsDevice;
}
