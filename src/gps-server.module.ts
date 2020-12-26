import { Module, Logger, DynamicModule } from '@nestjs/common';
import { GpsTCPServerService } from './gps-tcp-server.service';
import { DeviceFactory } from './factory';
import { GpsServerOptionsInterface } from './interface';
import { Echo } from './adapters';
import { GpsUDPServerService } from './gps-udp-server.service';

@Module({})
export class GpsServerModule {
  static async forRoot(options: GpsServerOptionsInterface): Promise<DynamicModule> {
    options.imports = options.imports ?? [];
    options.providers = options.providers ?? [];
    options.providers.push({ provide: 'GPS_CONFIG_OPTIONS', useValue: options });
    options.providers.push({ provide: 'GPS_DEVICE_FACTORY', useClass: (options.device_factory) ? options.device_factory : DeviceFactory });
    options.providers.push({ provide: 'GPS_LOGGER', useClass: (options.logger) ? options.logger : Logger });
    options.providers.push({ provide: 'GPS_ADAPTER', useClass: options.adapter ?? Echo });
    let useTCP = options.useTCP === true || (options.useUDP === undefined || options.useUDP === false);
    if (useTCP)
      options.providers.push(GpsTCPServerService);
    if (options.useUDP)
      options.providers.push(GpsUDPServerService);
    return {
      module: GpsServerModule,
      imports: options.imports,
      providers: options.providers
    };
  }
}
