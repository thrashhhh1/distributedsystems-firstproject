import { Module } from '@nestjs/common';

import { TrafficGeneratorService } from './traffic-generator.service';
import { StorageModule } from '../storage/storage.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule, StorageModule],
  providers: [TrafficGeneratorService],
})
export class TrafficGeneratorModule { }
