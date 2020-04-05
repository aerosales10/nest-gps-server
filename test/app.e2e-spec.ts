import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { GpsServerModule } from './../src/gps-server.module';
import { INestApplication } from '@nestjs/common';
import { TK103 } from '../src/adapters';
import { Socket } from 'net';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let socket: Socket = new Socket();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [GpsServerModule.register({
        port: 8086,
        adapter: TK103
      })],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
