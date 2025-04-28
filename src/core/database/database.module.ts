import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const mongoUri = configService.get<string>('MONGODB_URI');
                console.log(`Connecting to MongoDB at: ${mongoUri}`);
                return {
                    uri: mongoUri,
                };
            },
        }),
    ],
})
export class DatabaseModule { }