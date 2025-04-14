import { Module } from '@nestjs/common';
import { ScraperModule } from './scraper/scraper.module';
import { MongoDBModule } from './database/mongodb/mongodb.module';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [MongoDBModule, ScraperModule, AlertModule],
})
export class AppModule { }
