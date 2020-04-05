/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1));
__export(__webpack_require__(3));
__export(__webpack_require__(13));
__export(__webpack_require__(6));
__export(__webpack_require__(10));
__export(__webpack_require__(15));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GpsServerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(2);
const gps_server_service_1 = __webpack_require__(3);
const factory_1 = __webpack_require__(6);
const adapters_1 = __webpack_require__(13);
let GpsServerModule = GpsServerModule_1 = class GpsServerModule {
    static register(options, advanced_options) {
        var _a;
        return {
            module: GpsServerModule_1,
            providers: [
                gps_server_service_1.GpsServerService,
                {
                    provide: 'GPS_CONFIG_OPTIONS',
                    useValue: options
                },
                {
                    provide: 'GPS_DEVICE_FACTORY',
                    useClass: (advanced_options) ? advanced_options.device_factory : factory_1.DeviceFactory
                },
                {
                    provide: 'GPS_LOGGER',
                    useValue: (advanced_options) ? advanced_options.logger : common_1.Logger
                },
                {
                    provide: 'GPS_ADAPTER',
                    useClass: (_a = options.adapter) !== null && _a !== void 0 ? _a : adapters_1.Echo
                }
            ],
            exports: [gps_server_service_1.GpsServerService],
        };
    }
};
GpsServerModule = GpsServerModule_1 = __decorate([
    common_1.Module({})
], GpsServerModule);
exports.GpsServerModule = GpsServerModule;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(2);
const net_1 = __webpack_require__(4);
const events_1 = __webpack_require__(5);
const factory_1 = __webpack_require__(6);
let GpsServerService = class GpsServerService extends events_1.EventEmitter {
    constructor(options, factory, logger) {
        var _a;
        super({ captureRejections: true });
        this.options = options;
        this.options.bind = (_a = options.bind) !== null && _a !== void 0 ? _a : '0.0.0.0';
        this.logger = logger;
        this.factory = factory;
        this.devices = [];
    }
    onApplicationShutdown(signal) {
        this.server.removeAllListeners();
        this.server.close();
        delete this.devices;
    }
    onApplicationBootstrap() {
        let self = this;
        this.server = net_1.createServer(async (socket) => {
            self.logger.debug(`Incomming connection from ${socket.remoteAddress}`);
            const device = this.factory.create(socket);
            self.devices.push(device);
            socket.on('data', (data) => device.emit('data', data));
            socket.on('end', () => {
                let index = self.devices.findIndex((device, index) => {
                    if (device.socket.remoteAddress == socket.remoteAddress && device.socket.remotePort == socket.remotePort) {
                        self.devices.splice(index, 1);
                        return true;
                    }
                });
                if (index < 0)
                    return;
                self.logger.debug(`Device ${device.socket.remoteAddress}:${device.socket.remotePort} disconnected.`);
                device.emit('disconnected');
            });
        }).listen({
            host: this.options.bind,
            port: this.options.port
        });
        this.logger.debug(`The server is listening on ${this.options.bind}:${this.options.port}`);
    }
};
GpsServerService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('GPS_CONFIG_OPTIONS')),
    __param(1, common_1.Inject('GPS_DEVICE_FACTORY')),
    __param(2, common_1.Inject('GPS_LOGGER')),
    __metadata("design:paramtypes", [Object, factory_1.DeviceAbstractFactory, Object])
], GpsServerService);
exports.GpsServerService = GpsServerService;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(7));
__export(__webpack_require__(8));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DeviceAbstractFactory {
    constructor(adapter, logger) {
        this.adapter = adapter;
        this.logger = logger;
    }
    ;
}
exports.DeviceAbstractFactory = DeviceAbstractFactory;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(2);
const device_abstract_factory_1 = __webpack_require__(7);
const device_model_1 = __webpack_require__(9);
let DeviceFactory = class DeviceFactory extends device_abstract_factory_1.DeviceAbstractFactory {
    constructor(adapter, logger) {
        super(adapter, logger);
    }
    create(socket) {
        return new device_model_1.GpsDevice(this.adapter, socket, this.logger);
    }
};
DeviceFactory = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('GPS_ADAPTER')), __param(1, common_1.Inject('GPS_LOGGER')),
    __metadata("design:paramtypes", [Object, Object])
], DeviceFactory);
exports.DeviceFactory = DeviceFactory;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = __webpack_require__(10);
const abstract_device_model_1 = __webpack_require__(12);
class GpsDevice extends abstract_device_model_1.AbstractGpsDevice {
    constructor(adapter, socket, logger) {
        super(adapter, socket, logger);
    }
    getUID() {
        return this.uid;
    }
    async handle_action(action, message_parts) {
        if (action != interface_1.GPS_MESSAGE_ACTION.LOGIN_REQUEST && !this.loged) {
            await this.adapter.send_device_request_login();
            this.logger.debug(`${this.getUID()} is trying to ${interface_1.GPS_MESSAGE_ACTION[action]} but isn't logged. Action wasn't executed.`);
            return;
        }
        switch (action) {
            case interface_1.GPS_MESSAGE_ACTION.LOGIN_REQUEST:
                await this.handle_login_request(message_parts);
                break;
            case interface_1.GPS_MESSAGE_ACTION.PING:
                await this.handle_ping_action(message_parts);
                break;
            case interface_1.GPS_MESSAGE_ACTION.ALARM:
                await this.handle_alarm_action(message_parts);
                break;
            case interface_1.GPS_MESSAGE_ACTION.OTHER:
                this.handle_other_request(message_parts);
                break;
            default:
                this.logger.debug(`The action wasn't correct`);
                return;
        }
    }
    async handle_login_request(message_parts) {
        let can_login = await this.adapter.login_request(this.getUID(), message_parts);
        this.login(can_login);
        const login_event = { uid: this.getUID(), message: message_parts, ip: this.ip };
        return this.emit('login_request', login_event);
    }
    async handle_other_request(message_parts) {
        return this.emit('other_request', message_parts);
    }
    async login(can_login) {
        if (!can_login) {
            this.logger.warn(`Device ${this.getUID()} not authorized. Login request was rejected. IP ${this.ip}`);
            const login_fail_event = { uid: this.getUID(), ip: this.ip };
            this.emit('login_fail', login_fail_event);
            return;
        }
        this.loged = true;
        await this.adapter.send_device_authorized();
        this.logger.debug(`Device ${this.getUID()} has been authorized.`);
    }
    async logout() {
        this.loged = false;
        await this.adapter.request_logout();
    }
    async handle_ping_action(message_parts) {
        const gps_data = await this.adapter.get_ping_data(message_parts);
        if (!gps_data) {
            this.logger.debug(`GPS data can't be parsed. Discarding the packet.`);
            return false;
        }
        this.logger.debug(`Position received ( ${gps_data.latitude}, ${gps_data.longitude} ) ${gps_data.date}`);
        const ping_event = { uid: this.getUID(), gps_data: gps_data, message: message_parts };
        return this.emit('ping', ping_event);
    }
    async handle_alarm_action(message_parts) {
        const alarm_data = await this.adapter.get_alarm_data(message_parts);
        if (!alarm_data) {
            this.logger.debug(`Alarm data can't be parsed. Discarding the packet.`);
            return false;
        }
        this.logger.debug(`Alarm received ( ${alarm_data.code}, ${alarm_data.msg} )`);
        const alarm_event = { uid: this.getUID(), alarm_data: alarm_data, message: message_parts };
        return this.emit('alarm', alarm_event);
    }
    async set_refresh_time(interval) {
        return this.adapter.set_refresh_time(interval);
    }
    async send(msg) {
        return this.socket.write(msg);
    }
    ;
}
exports.GpsDevice = GpsDevice;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(11));
__export(__webpack_require__(11));


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GPS_MESSAGE_ACTION;
(function (GPS_MESSAGE_ACTION) {
    GPS_MESSAGE_ACTION[GPS_MESSAGE_ACTION["LOGIN_REQUEST"] = 0] = "LOGIN_REQUEST";
    GPS_MESSAGE_ACTION[GPS_MESSAGE_ACTION["PING"] = 1] = "PING";
    GPS_MESSAGE_ACTION[GPS_MESSAGE_ACTION["ALARM"] = 2] = "ALARM";
    GPS_MESSAGE_ACTION[GPS_MESSAGE_ACTION["OTHER"] = 3] = "OTHER";
})(GPS_MESSAGE_ACTION = exports.GPS_MESSAGE_ACTION || (exports.GPS_MESSAGE_ACTION = {}));


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
class AbstractGpsDevice extends events_1.EventEmitter {
    constructor(adapter, socket, logger) {
        super({ captureRejections: true });
        this.adapter = adapter;
        this.socket = socket;
        this.ip = socket.remoteAddress;
        this.port = socket.remotePort;
        this.on('data', this.handle_data);
        this.logger = logger || common_1.Logger;
        this.adapter.device = this;
    }
    getUID() {
        return this.uid;
    }
    async handle_data(data) {
        const parts = await this.adapter.parse_data(data);
        if (!parts) {
            this.logger.debug(`The message: ${data} can't be parsed. Discarding`);
            return;
        }
        if (!this.getUID() && !parts.device_id) {
            this.logger.debug(`The adapter doesn't return the device_id`);
            return;
        }
        if (!parts.cmd) {
            this.logger.debug(`The adapter doesn't return the command (cmd) property`);
            return;
        }
        this.uid = parts.device_id;
        await this.handle_action(parts.action, parts);
    }
}
exports.AbstractGpsDevice = AbstractGpsDevice;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(14));


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = __webpack_require__(10);
class Echo {
    async parse_data(data) {
        let str_data = data.toString().trim();
        let response = {
            action: interface_1.GPS_MESSAGE_ACTION.PING,
            cmd: "Echo",
            data: str_data,
            device_id: "1234567890"
        };
        if (str_data == "login")
            response.action = interface_1.GPS_MESSAGE_ACTION.LOGIN_REQUEST;
        return response;
    }
    async get_alarm_data(message) {
        return {
            code: "200",
            msg: "Hello there",
            custom: message.data
        };
    }
    async get_ping_data(message) {
        this.device.send(`${JSON.stringify(message)}\r\n`);
        return {
            date: new Date(),
            latitude: 0,
            longitude: 0,
            custom: message.data
        };
    }
    async send_device_authorized() {
        await this.device.send("Echo loged\r\n");
        return;
    }
    async send_device_request_login() {
        await this.device.send("Please you must login using the login word\r\n");
        return;
    }
    async get_other_actions(parts) {
        return {
            custom: parts.data
        };
    }
    async request_logout() {
        await this.device.send("Please logout\r\n");
        return true;
    }
    async set_refresh_time(interval) {
        return true;
    }
    async login_request(uid, message) {
        return true;
    }
}
exports.Echo = Echo;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(9));
__export(__webpack_require__(12));


/***/ })
/******/ ]);