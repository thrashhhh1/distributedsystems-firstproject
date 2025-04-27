import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './core/database/mongodb/database.module';
import { CacheModule } from './core/cache/cache.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { StorageModule } from './modules/storage/storage.module';
import { EnvConfiguration } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      isGlobal: true,
    }),
    DatabaseModule, CacheModule, ScraperModule, StorageModule],
})
export class AppModule { }
