import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {

    @Prop()
    buyer_id: string;

    @Prop()
    seller_id: string;

    @Prop()
    amount: number;

    @Prop()
    date: Date;

    @Prop()
    status: number;

    @Prop()
    request_status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);