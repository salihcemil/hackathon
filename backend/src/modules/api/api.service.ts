
import { Model } from 'mongoose';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Payment, PaymentDocument } from 'src/schemas/payment.schema';
import { HttpService } from "@nestjs/axios";
import { lastValueFrom, map } from "rxjs";


@Injectable()
export class ApiService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private readonly httpService: HttpService,
  ) {}

  async create(user:User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async sendPurchaseRequestByBuyer(payment: Payment): Promise<Payment> {
    try {
      await this.userModel.findOne({_id: payment.buyer_id }).exec();
      await this.userModel.findOne({ id: payment.seller_id, is_buyer: false }).exec();
      payment.date = new Date(Date.now());
      payment.status = 0;
      payment.request_status = 0;
      const createdPayment = new this.paymentModel(payment);
      return createdPayment.save();
      } catch (error) {
        throw new BadRequestException(error.message);
      }
  }

  async getSellerRequests(): Promise<Payment[]> {
    return this.paymentModel.find().exec();
  }

  // request_status: 1 --> satıcı kabul etti 2 --> alıcı kabul etti
  // satıcı kabul etti
  async acceptPurchaseRequestBySeller(paymentId:string): Promise<Payment> {
    //lock funds çağırılacak
    try {
      const payment = await this.paymentModel.findOne({ _id: paymentId }).exec()
      console.log(payment);
      if(payment.status == 0){

        const requestConfig = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const resultcreate = await lastValueFrom(
          this.httpService.post("http://localhost:3010/api/createRecord/", { paymentId,sender: "0xa9226A2cdFF39799a7ff2C8eDE394565b8Bb0EF6",receiver:"0x12CF046B997F185cd644e0fF369C3f19379AB6CF",amountInWei: payment.amount, fiat: (35000*payment.amount) }, requestConfig).pipe(
              map(res => res)
          )
      );
        const result = await lastValueFrom(
            this.httpService.post("http://localhost:3010/api/lockFund/", { paymentId, amountInWei: payment.amount }, requestConfig).pipe(
                map(res => res)
            )
        );
        console.log("result", result);
        console.log("resultcreate", resultcreate);  
        payment.status = 1;
        payment.request_status = 1;
        await this.paymentModel.findByIdAndUpdate(paymentId, payment).exec();
      }
       // seller tarafından onaylandı transaction gerçekleşmesi bekleniyor
      return payment;
    } catch (error) {
        throw new InternalServerErrorException(error.message);
    }
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

  async getEthPurchaseRequests(): Promise<Payment[]> {
    return this.paymentModel.find({
      request_status: 1
    }).exec();
  }
}