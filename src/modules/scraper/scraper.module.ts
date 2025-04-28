import { Module } from '@nestjs/common';

import { ScraperService } from './scraper.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [ScraperService],
})
export class ScraperModule { }

