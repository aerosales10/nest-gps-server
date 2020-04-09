import { NestFactory } from "@nestjs/core";
import { GpsServerModule } from "./gps-server.module";
import { TK103, GPS103 } from "./adapters";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(GpsServerModule.forRoot({
        port: 8086,
        adapter: TK103,
        useTCP: true,
        useUDP: true
    }));
}
bootstrap();