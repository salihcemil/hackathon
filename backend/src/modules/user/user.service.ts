
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Payment, PaymentDocument } from 'src/schemas/payment.schema';
import { HttpService } from "@nestjs/axios";
import { lastValueFrom, map } from "rxjs";


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private readonly httpService: HttpService,

  ) {}

  async create(user:User): Promise<User> {
    const createdCat = new this.userModel(user);
    return createdCat.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async buyRequest(payment:Payment): Promise<Payment> {
    const createdPayment = new this.paymentModel(payment);
    return createdPayment.save();
  }

  async getSellerRequests(): Promise<Payment[]> {
    return this.paymentModel.find().exec();
  }

  // request_status: 1 --> satıcı kabul etti 2 --> alıcı kabul etti

  // satıcı kabul etti
  async acceptBuyRequest(paymentId:string): Promise<Payment> {
    //lock funds çağırılacak
    try {
      const requestConfig = {
          headers: {
            'Content-Type': 'application/json',
          },
      };
      const result = await lastValueFrom(
          this.httpService.post("localhost:3010/api/lockFund/", { paymentId}, requestConfig).pipe(
              map(res => res)
          )
      );
      console.log("result", result); 
    } catch (error) {
        console.log(error);
    }
    return this.paymentModel.findByIdAndUpdate(paymentId, {request_status: 1, status:1}).exec();
  }

  // 
  async doTransfer(paymentId:string): Promise<Payment> {
     // release funds çağırılacak
     let status = 0;

     try {
      const requestConfig = {
          headers: {
            'Content-Type': 'application/json',
          },
      };
      const result = await lastValueFrom(
          this.httpService.post("localhost:3010/api/releaseFund/", {paymentId}, requestConfig).pipe(
              map(res => res)
          )
      );
      console.log("result", result); 
      status = 2;
    } catch (error) {
        status = 3; 
        console.log(error);
    }
     this.paymentModel.findByIdAndUpdate(paymentId, {request_status: 2,status}).exec();
     return null;
  }

  async getMoneyTransferRequests(): Promise<Payment[]> {
    return this.paymentModel.find({
      status: 2
    }).exec();
  }
}