import { GpsDeviceInterface, GpsAdapterInterface } from '../interface'
import { Socket } from 'net';
import { LoggerService, Injectable, Inject } from '@nestjs/common';
import { DeviceAbstractFactory } from './device-abstract.factory';
import { GpsDevice } from '../models/device.model';

@Injectable()
export class DeviceFactory extends DeviceAbstractFactory {
    constructor(@Inject('GPS_ADAPTER') adapter: GpsAdapterInterface, logger: LoggerService) {
        super(adapter, logger);
    }
    public create(socket: Socket): GpsDeviceInterface {
        return new GpsDevice(this.adapter, socket, this.logger);
    }
}