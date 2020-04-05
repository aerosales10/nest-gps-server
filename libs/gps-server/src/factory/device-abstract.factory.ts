import { GpsAdapterInterface } from '../interface'
import { Socket } from 'net';
import { LoggerService } from '@nestjs/common';
import { AbstractGpsDevice } from '../models';

export abstract class DeviceAbstractFactory {
    protected adapter: GpsAdapterInterface;
    protected logger: LoggerService;
    constructor(adapter: GpsAdapterInterface, logger: LoggerService) {
        this.adapter = adapter;
        this.logger = logger;
    };
    public abstract create(socket: Socket): AbstractGpsDevice;
}