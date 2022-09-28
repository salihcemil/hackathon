import { Body, Controller, Get, Post } from "@nestjs/common";
import { User } from "src/schemas/user.schema";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
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