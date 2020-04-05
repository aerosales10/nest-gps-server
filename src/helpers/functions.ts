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