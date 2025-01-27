import { MediaDto } from 'src/medias/dto/media.dto';
export declare class CreateUserDto {
    username: string;
    password: string;
    profilePhoto: MediaDto;
    email: string;
    bio: string;
    gender: string;
    pronoun: string;
}
