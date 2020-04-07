import { Module, Logger, DynamicModule } from '@nestjs/common';
import { GpsServerService } from './gps-server.service';
import { DeviceFactory } from './factory';
import { GpsServerOptionsInterface } from './interface';
import { Echo } from './adapters';

@Module({})
export class GpsServerModule {
  static async forRoot(options: GpsServerOptionsInterface): Promise<DynamicModule> {
    options.imports = options.imports ?? [];
    options.providers = options.providers ?? [];
    options.providers.push({ provide: 'GPS_CONFIG_OPTIONS', useValue: options });
    options.providers.push({ provide: 'GPS_DEVICE_FACTORY', useClass: (options.device_factory) ? options.device_factory : DeviceFactory });
    options.providers.push({ provide: 'GPS_LOGGER', useValue: (options.logger) ? options.logger : Logger });
    options.providers.push({ provide: 'GPS_ADAPTER', useClass: options.adapter ?? Echo });
    options.providers.push(GpsServerService);
    return {
      module: GpsServerModule,
      imports: options.imports,
      providers: options.providers
    };
  }
}
