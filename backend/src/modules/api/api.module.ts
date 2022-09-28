import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema}])],
    providers: [ApiService],
    controllers: [ApiController]
})
export class ApiModule {}
