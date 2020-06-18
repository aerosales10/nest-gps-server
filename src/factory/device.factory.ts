import { GpsAdapterInterface } from '../interface'
import { Socket as TCPSocket } from 'net';
import { Socket as UDPSocket } from 'dgram';
import { LoggerService, Injectable, Inject } from '@nestjs/common';
import { DeviceAbstractFactory } from './device-abstract.factory';
import { GpsDevice } from '../models/device.model';
import { AbstractGpsDevice } from '../models';

@Injectable()
export class DeviceFactory extends DeviceAbstractFactory {
    constructor(@Inject('GPS_ADAPTER') adapter: GpsAdapterInterface, @Inject('GPS_LOGGER') logger: LoggerService) {
        super(adapter, logger);
    }
    public create(socket: TCPSocket | UDPSocket): AbstractGpsDevice {
        return new GpsDevice(Object.create(this.adapter), socket, this.logger);
    }
}