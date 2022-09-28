import "dotenv";
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiModule } from './modules/api/api.module';

@Module({
  imports: [
    ApiModule,
    MongooseModule.forRoot("mongodb_url")
  ],
})
export class AppModule {}