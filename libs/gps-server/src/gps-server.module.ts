import { Module, Logger, LoggerService } from '@nestjs/common';
import { GpsServerService } from './gps-server.service';
import { DeviceAbstractFactory, DeviceFactory } from './factory';
import { GPS103 } from './adapters';
@Module({
  providers: [GpsServerService, {
    provide: 'GPS_CONFIG_OPTIONS',
    useValue: {
      port: 8086,
      bind: 'localhost'
    }
  }, {
    provide: DeviceAbstractFactory,
    useClass: DeviceFactory
  },{
    provide: Logger,
    useValue: Logger
  },{
    provide: 'GPS_ADAPTER',
    useClass: GPS103
  }],
  exports: [GpsServerService],
})
export class GpsServerModule { }
