import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GpsServerModule } from '@miraibit/gps-server';

@Module({
  imports: [GpsServerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
