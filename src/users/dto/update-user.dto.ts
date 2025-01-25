import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { AnyOf } from 'src/common/pipes/any-of.pipe';

@AnyOf(['bio', 'gender', 'pronoun', 'profilePhoto'])
export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'password',
  'email',
  'username',
]) {}
