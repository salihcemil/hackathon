import { Body, Controller, Get, Post } from "@nestjs/common";
import { User } from "src/schemas/user.schema";
import { ApiService } from "./api.service";

@Controller('user')
export class ApiController {
    constructor(
        private userService: ApiService,
    ){}

    @Post()
    createUser(@Body() user: User): Promise<User> {
        return this.userService.create(user);
    }

    @Get()
    getUsers(): Promise<User[]> {
        return this.userService.findAll()
    }
}