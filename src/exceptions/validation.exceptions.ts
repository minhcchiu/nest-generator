import { BadRequestException, ValidationError } from "@nestjs/common";
import { NodeEnv } from "src/configurations/enums/config.enum";
import { EnvStatic } from "src/configurations/env.static";
import { ErrorDetail } from "~types/error-detail.type";

function transform(errors: ValidationError[]): ErrorDetail[] {
  return errors.map(error => {
    return {
      property: error.property || undefined,
      message: error.constraints
        ? Object.values(error.constraints)[0]
        : getChildMessage(error.children),
      errors: error.children?.length ? transform(error.children) : undefined,
      details: getErrorDetails(error),
    };
  });
}

function getErrorDetails(error: ValidationError) {
  if (EnvStatic.getAppConfig().nodeEnv === NodeEnv.Development)
    return error.constraints ? Object.values(error.constraints) : undefined;

  return undefined;
}

function getChildMessage(errors: ValidationError[]) {
  const keys = errors.map(error => {
    return error.children?.length ? error.children.map(error => error.property) : error.property;
  });

  const properties = [...new Set(keys.flat(keys.length))];

  return `${properties.join(", ")} have validation errors`;
}

export class ValidationExceptions extends BadRequestException {
  constructor(public validationErrors: ValidationError[]) {
    super({
      errorType: "ValidationError",
      errors: transform(validationErrors),
    });
  }
}
