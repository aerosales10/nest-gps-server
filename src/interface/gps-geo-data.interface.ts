export interface GpsGeoDataInterface {
    status?: string;
    date: Date;
    fixed?: boolean;
    latitude: number;
    longitude: number;
    altitude?: number;
    speed?: number;
    orientation?: string | number;
    custom?: object;
}