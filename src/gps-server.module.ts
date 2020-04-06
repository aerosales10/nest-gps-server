import { Module, Logger, DynamicModule } from '@nestjs/common';
import { GpsServerService } from './gps-server.service';
import { DeviceFactory } from './factory';
import { GpsServerOptionsInterface, GpsAdvancedOptionsInterface } from './interface';
import { Echo } from './adapters';
import { ModuleMetadata } from '@nestjs/common/interfaces';
@Module({})
export class GpsServerModule {
  static register(options: GpsServerOptionsInterface, metadata?: ModuleMetadata, advanced_options?: GpsAdvancedOptionsInterface): DynamicModule {
    metadata.providers.push({ provide: 'GPS_CONFIG_OPTIONS', useValue: options });
    metadata.providers.push({ provide: 'GPS_DEVICE_FACTORY', useClass: (advanced_options) ? advanced_options.device_factory : DeviceFactory });
    metadata.providers.push({ provide: 'GPS_LOGGER', useValue: (advanced_options) ? advanced_options.logger : Logger });
    metadata.providers.push({ provide: 'GPS_ADAPTER', useClass: options.adapter ?? Echo });
    metadata.providers.push(GpsServerService);
    metadata.exports.push(GpsServerService);
    return {
      module: GpsServerModule,
      ...metadata
    };
  }
}
