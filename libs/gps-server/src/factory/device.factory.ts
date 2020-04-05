import { GpsAdapterInterface } from '../interface'
import { Socket } from 'net';
import { LoggerService, Injectable, Inject, Logger } from '@nestjs/common';
import { DeviceAbstractFactory } from './device-abstract.factory';
import { GpsDevice } from '../models/device.model';
import { AbstractGpsDevice } from '../models';

@Injectable()
export class DeviceFactory extends DeviceAbstractFactory {
    constructor(@Inject('GPS_ADAPTER') adapter: GpsAdapterInterface, logger: Logger) {
        super(adapter, logger);
    }
    public create(socket: Socket): AbstractGpsDevice {
        return new GpsDevice(this.adapter, socket, this.logger);
    }
}