import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {hash} from "../common/utils/hash.utils";

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
    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {id, isActive: true}
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    //
    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {email: email}
        })
        if (!user) throw new NotFoundException("User not found");
        return user;
    }

    //Update User
    async update(id: number, dto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {id}
        });

        if (!user) throw new NotFoundException("User not found");

        Object.assign(user, dto);
        return await this.userRepository.save(user);
    }

    // Soft Delete /Deactivate
    async deactivate(id: number): Promise<void>{
        const result = await this.userRepository.update(id, {
            isActive: false
        });
        if(result.affected === 0) {
            throw new NotFoundException("User not found");
        }
    }

    async updateRefreshToken(userId: number, refreshTokenHash: string):Promise<void> {

        const result = await this.userRepository.update({id: userId}, {refreshTokenHash});

        if(result.affected === 0) {
            throw new NotFoundException("User not found");
        }
    }

    async removeRefreshToken(userId: number): Promise<void> {
        await this.userRepository.update(
            {id: userId},
            {refreshTokenHash: undefined},
        )
    }

}