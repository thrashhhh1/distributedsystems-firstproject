import { Module } from '@nestjs/common';

import { TrafficGeneratorController } from './traffic-generator.controller';
import { TrafficGeneratorService } from './traffic-generator.service';
import { StorageModule } from '../storage/storage.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule, StorageModule],
  controllers: [TrafficGeneratorController],
  providers: [TrafficGeneratorService],
})
export class TrafficGeneratorModule { }
