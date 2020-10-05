import { NestFactory } from "@nestjs/core";
import { GpsServerModule } from "./gps-server.module";
import { TK103, GPS103, Echo } from "./adapters";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(GpsServerModule.forRoot({
        port: 8086,
        adapter: Echo,
        useTCP: true,
        useUDP: true
    }));
}
bootstrap();