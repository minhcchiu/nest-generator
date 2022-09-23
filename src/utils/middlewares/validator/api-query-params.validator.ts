import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export const queryParamValidatorDto = async <T extends ClassConstructor<any>>(
  dto: T,
  obj: any,
) => {
  // tranform the literal object to class object
  const objInstance = plainToClass(dto, obj);

  // validating and check the errors, throw the errors if exist
  const errors = await validate(objInstance);

  // errors is an array of validation errors
  if (errors.length > 0) {
    throw new TypeError(
      `The error fields : ${errors.map(({ property }) => property)}`,
    );
  }
};
