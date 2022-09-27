import "dotenv";
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    UserModule,
    MongooseModule.forRoot("mongodb_url")
  ],
})
export class AppModule {}