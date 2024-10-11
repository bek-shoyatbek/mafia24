import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    password: string;
}