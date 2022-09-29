import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from 'src/schemas/payment.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema}, 
            { name: Payment.name, schema: PaymentSchema}
        ])],
    providers: [ApiService],
    controllers: [ApiController]
})
export class ApiModule {}
