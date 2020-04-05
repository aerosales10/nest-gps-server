import { Module, Logger, DynamicModule } from '@nestjs/common';
import { GpsServerService } from './gps-server.service';
import { DeviceFactory } from './factory';
import { GpsServerOptionsInterface, GpsAdvancedOptionsInterface } from './interface';
import { Echo } from './adapters';
@Module({})
export class GpsServerModule {
  static register(options: GpsServerOptionsInterface, advanced_options?: GpsAdvancedOptionsInterface): DynamicModule {
    return {
      module: GpsServerModule,
      providers: [
        GpsServerService,
        {
          provide: 'GPS_CONFIG_OPTIONS',
          useValue: options
        },
        {
          provide: 'GPS_DEVICE_FACTORY',
          useClass: (advanced_options) ? advanced_options.device_factory : DeviceFactory
        },
        {
          provide: 'GPS_LOGGER',
          useValue: (advanced_options) ? advanced_options.logger : Logger
        },
        {
          provide: 'GPS_ADAPTER',
          useClass: options.adapter ?? Echo
        }],
      exports: [GpsServerService],
    };
  }
}
