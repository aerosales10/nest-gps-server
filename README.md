# NEST GPS SERVER

## Description

A GPS server for Nestjs framework. This server was based on [freshworkstudio/gps-tracking-nodejs](https://github.com/freshworkstudio/gps-tracking-nodejs) but it was build from ground up without externals dependencies.

## Protocols

Only supports an Echo protocol for testing. More protocols will be added in the future like GPS103, gk103, etc.

You can also add easy new protocols by implementing the GpsAdapterInterface and passing the class in the module initialization.

```typescript
export class Echo implements GpsAdapterInterface {
    device: GpsDeviceInterface;

    async parse_data(data: string | Buffer): Promise<GpsMessagePartsInterface> {
        let str_data = data.toString().trim();
        let response = {
            action: GPS_MESSAGE_ACTION.PING,
            cmd: "Echo",
            data: str_data,
            device_id: "1234567890"
        };

        if (str_data == "login")
            response.action = GPS_MESSAGE_ACTION.LOGIN_REQUEST;

        return response;
    }
    async get_alarm_data(message: GpsMessagePartsInterface): Promise<GpsAlarmDataInterface> {
        return {
            code: "200",
            msg: "Hello there",
            custom: message.data
        };
    }
    async get_ping_data(message: GpsMessagePartsInterface): Promise<GpsPingDataInterface> {
        this.device.send(`${JSON.stringify(message)}\r\n`);
        return {
            date: new Date(),
            latitude: 0,
            longitude: 0,
            custom: message.data
        };
    }
    async send_device_authorized(): Promise<void> {
        await this.device.send("Echo loged\r\n");
        return;
    }
    async send_device_request_login(): Promise<void> {
        await this.device.send("Please you must login using the login word\r\n");
        return;
    }
    async get_other_actions(parts: GpsMessagePartsInterface): Promise<GpsOtherActionsDataInterface> {
        return {
            custom: parts.data
        };
    }
    async request_logout(): Promise<boolean> {
        await this.device.send("Please logout\r\n");
        return true;
    }
    async set_refresh_time(interval: number): Promise<boolean> {
        return true;
    }

    async login_request(uid: string, message: GpsMessagePartsInterface): Promise<boolean> {
        return true;
    }
}
```

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GpsServerModule, Echo } from '@aerosales10/nest-gps-server';
@Module({
  imports: [GpsServerModule.register({
    port: 8086,
    adapter: Echo
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Installation

```bash
$ npm install @aerosales10/nest-gps-server --save
```

## Importing the server module

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GpsServerModule } from '@aerosales10/nest-gps-server';
@Module({
  imports: [GpsServerModule.register({
    port: 8086
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## License

  Nest GPS server is MIT licensed
