import {IsEmail, IsInt, IsNotEmpty, IsString} from "class-validator";

export class UpdateUserDto{
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsInt()
    heightCm: number;

    @IsInt()
    weightKg: number;


}