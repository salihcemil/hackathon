import 'dotenv';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiModule } from './modules/api/api.module';

@Module({
  imports: [
    ApiModule,
    MongooseModule.forRoot(
      'mongodb+srv://lokumteam:pMtxsRkSB4CvGHcE@lokum.e8ff9j8.mongodb.net/?retryWrites=true&w=majority',
    ),
  ],
})
export class AppModule {}
