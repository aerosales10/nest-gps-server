import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GpsServerModule } from './gps-server.module';
@Module({
  imports: [GpsServerModule.register({
    port: 8086
  })],
  providers: [AppService],
})
export class AppModule {}
