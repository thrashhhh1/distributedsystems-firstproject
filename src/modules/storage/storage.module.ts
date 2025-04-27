import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Alert } from './entities/alert.entity';
import { AlertSchema } from './entities/alert.entity';
import { ScraperModule } from 'src/modules/scraper/scraper.module';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Alert.name,
        schema: AlertSchema
      }
    ]),
    ScraperModule
  ],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule { }
 