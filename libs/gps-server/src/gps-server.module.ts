import { Module } from '@nestjs/common';
import { GpsServerService } from './gps-server.service';

@Module({
  providers: [GpsServerService],
  exports: [GpsServerService],
})
export class GpsServerModule {}
