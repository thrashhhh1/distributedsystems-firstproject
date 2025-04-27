// src/database/database.module.ts (o mongodb.module.ts)
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const mongoUri = configService.get<string>('MONGODB_URL');
                console.log(`Connecting to MongoDB at: ${mongoUri}`);
                return {
                    uri: mongoUri,
                };
            },
        }),
    ],
})
export class DatabaseModule { } // O export class MongoDBModule {}