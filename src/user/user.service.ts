import {ConflictException, Injectable, Module} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    // Create User
    async create(dto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({
            where: {email: dto.email}
        });

        if (existingUser) {
            throw new ConflictException("Email already exists");
        }

        const user = this.userRepository.create(dto);
        return await this.userRepository.save(user);
    }

    // Get User

}