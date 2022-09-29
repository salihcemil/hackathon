import { Body, Controller, Get, Post } from "@nestjs/common";
import { Payment } from "src/schemas/payment.schema";
import { User } from "src/schemas/user.schema";
import { ApiService } from "./api.service";

@Controller('api')
export class ApiController {
    constructor(
        private apiService: ApiService,
    ){}

    @Get("user")
    getUsers(): Promise<User[]> {
        return this.apiService.findAll()
    }

    @Get("eth/requests")
    getEthPurchaseRequests(): Promise<Payment[]>{
        return this.apiService.getEthPurchaseRequests();
    }

    @Get("seller/requests")
    getSellerRequests(): Promise<Payment[]> {
        return this.apiService.getSellerRequests();
    }

    @Post("user")
    createUser(@Body() user: User): Promise<User> {
        return this.apiService.create(user);
    }

    @Post("buyer/purchase")
    sendPurchaseRequestByBuyer(@Body()payment: Payment): Promise<Payment> {
        return this.apiService.sendPurchaseRequestByBuyer(payment);
    }

    @Post("transfer")
    doTransfer(@Body("payment_id")payment_id: string): Promise<Payment> {
        return this.apiService.doTransfer(payment_id);
    }

    @Post("seller/purchase")
    acceptPurchaseRequestBySeller(@Body("payment_id")payment_id: string): Promise<Payment> {
        return this.apiService.acceptPurchaseRequestBySeller(payment_id);
    }
}