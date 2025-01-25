import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { AnyOf } from 'src/common/pipes/any-of.pipe';

@AnyOf(['title', 'content'])
export class UpdatePostDto extends OmitType(PartialType(CreatePostDto), [
  'medias',
]) {}
