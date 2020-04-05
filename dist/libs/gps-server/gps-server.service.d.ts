/// <reference types="node" />
import { OnApplicationBootstrap, OnApplicationShutdown, LoggerService } from '@nestjs/common';
import { Server } from 'net';
import { EventEmitter } from 'events';
import { GpsServerOptionsInterface } from './interface';
import { DeviceAbstractFactory } from './factory';
import { AbstractGpsDevice } from './models';
export declare class GpsServerService extends EventEmitter implements OnApplicationBootstrap, OnApplicationShutdown {
    protected server: Server;
    protected devices: Array<AbstractGpsDevice>;
    protected options: GpsServerOptionsInterface;
    protected logger: LoggerService;
    protected factory: DeviceAbstractFactory;
    constructor(options: GpsServerOptionsInterface, factory: DeviceAbstractFactory, logger: LoggerService);
    onApplicationShutdown(signal?: string): void;
    onApplicationBootstrap(): void;
}
