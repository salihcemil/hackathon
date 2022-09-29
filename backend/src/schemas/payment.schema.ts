import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {

    @Prop({ required: true })
    buyer_id: string;

    @Prop({ required: true })
    seller_id: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ type: Date, required: true })
    date: Date;

    @Prop()
    status: number;

    @Prop()
    request_status: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);