import {IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min} from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsInt()
    @Min(10)
    @Max(100)
    age?: number;


}