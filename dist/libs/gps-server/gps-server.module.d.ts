import { DynamicModule } from '@nestjs/common';
import { GpsServerOptionsInterface, GpsAdvancedOptionsInterface } from './interface';
export declare class GpsServerModule {
    static register(options: GpsServerOptionsInterface, advanced_options?: GpsAdvancedOptionsInterface): DynamicModule;
}
