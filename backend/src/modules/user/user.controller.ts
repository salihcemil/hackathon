import { Controller, Get, Post } from "@nestjs/common";
import { User } from "src/schemas/user.schema";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
    ){}

    @Post()
    createUser(): Promise<User> {
        return this.userService.create();
    }

    @Get()
    getUsers(): Promise<User[]> {
        return this.userService.findAll()
    }
}