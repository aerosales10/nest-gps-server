import { Type } from "@nestjs/common";
import { GpsAdapterInterface } from "./adapter.interface";
export interface GpsServerOptionsInterface {
    port: number;
    bind?: string;
    adapter?: Type<GpsAdapterInterface>;
}
