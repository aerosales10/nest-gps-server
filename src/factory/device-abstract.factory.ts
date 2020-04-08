import { GpsAdapterInterface } from '../interface'
import { Socket as TCPSocket } from 'net';
import { LoggerService } from '@nestjs/common';
import { AbstractGpsDevice } from '../models';
import { Socket as UDPSocket } from 'dgram';

export abstract class DeviceAbstractFactory {
    protected adapter: GpsAdapterInterface;
    protected logger: LoggerService;
    constructor(adapter: GpsAdapterInterface, logger: LoggerService) {
        this.adapter = adapter;
        this.logger = logger;
    };
    public abstract create(socket: TCPSocket | UDPSocket): AbstractGpsDevice;
}