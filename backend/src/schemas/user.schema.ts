import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

    @Prop()
    email: string;

    @Prop()
    full_name: string;

    @Prop()
    longtitude: number;

    @Prop()
    latitude: number;

    @Prop()
    eth: number;

    @Prop()
    wallet_address: string;

    @Prop()
    is_buyer: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);