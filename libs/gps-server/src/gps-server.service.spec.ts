import { Test, TestingModule } from '@nestjs/testing';
import { GpsServerService } from './gps-server.service';

describe('GpsServerService', () => {
  let service: GpsServerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GpsServerService],
    }).compile();

    service = module.get<GpsServerService>(GpsServerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
