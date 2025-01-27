import { CreatePostDto } from './create-post.dto';
declare const UpdatePostDto_base: import("@nestjs/mapped-types").MappedType<Omit<Partial<CreatePostDto>, "medias">>;
export declare class UpdatePostDto extends UpdatePostDto_base {
}
export {};
