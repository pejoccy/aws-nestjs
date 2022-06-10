import { Injectable } from '@nestjs/common';
import {
  buildMessage,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PASSWORD_POLICY_REGEX } from '../interfaces';

@Injectable()
@ValidatorConstraint({ name: 'IsPassword', async: true })
export class IsPasswordRule implements ValidatorConstraintInterface {
  async validate(value: string) {
    const passwdRegex = new RegExp(PASSWORD_POLICY_REGEX);

    return passwdRegex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    const messageBuilder = buildMessage(
      (prefix) => `${prefix}$property is too weak. ${prefix}$property must be a combination of letters (uppercase and lowercase) numbers and special characters with 8 characters minimum.`
    );

    return messageBuilder(args);
  }
}

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsPasswordRule,
    });
  };
}
