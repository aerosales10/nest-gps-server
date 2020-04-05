export interface GpsPingDataInterface {
    date: Date;
    fixed?: boolean;
    latitude: number;
    longitude: number;
    speed?: number;
    orientation?: string | number;
    custom?: object;
}