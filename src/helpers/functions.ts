// import * as crc from 'crc';
// import { isString } from 'util';

export function rads(x: number): number {
    return x * Math.PI / 180;
};

export function minute_to_decimal(pos: number, cardinal_direction: string): number {
    if (typeof (cardinal_direction) === 'undefined') cardinal_direction = 'N';
    var dg = pos / 100;
    var minutes = pos - (dg * 100);
    var res = (minutes / 60) + dg;
    return (cardinal_direction.toUpperCase() === 'S' || cardinal_direction.toUpperCase() === 'W') ? res * -1 : res;
};

export function str_pad(input: string, length: number, string: string) {
    string = string || '0';
    input = input + '';
    return input.length >= length ? input : new Array(length - input.length + 1).join(string) + input;
};

// function hex_array_to_hex_str(hex_array) {
//     var str = '';
//     for (var i in hex_array) {
//         var char;
//         if (typeof (hex_array[i]) === 'number') char = hex_array[i].toString(16);
//         else char = hex_array[i].toString();
//         str += exports.str_pad(char, 2, '0');
//     }
//     return str;
// };

// export function crc_itu_get_verification(hex_data) {
//     var crc16 = require('crc-itu').crc16;
//     let str = "";

//     if (isString(hex_data)) str = hex_data;
//     else str = hex_array_to_hex_str(hex_data);
//     return crc16(str, 'hex');
// };