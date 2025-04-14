import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Alert } from './entities/alert.entity';
import { AlertSchema } from './entities/alert.entity';
import { ScraperModule } from 'src/scraper/scraper.module';

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
  controllers: [AlertController],
  providers: [AlertService],
})
export class AlertModule { }
