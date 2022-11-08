import { phone } from 'phone';

import { BadRequestException } from '@nestjs/common';

/**
 * Validate phone
 *
 * @param zipCode
 * @param phoneNumber
 * @param country
 * @returns
 */
export const isPhoneValid = (zipCode: string, phoneNumber: string, country?: string | undefined) => {
  const resultPhoneValidate = phone(`${zipCode}${phoneNumber}`, { country });

  if (!resultPhoneValidate) return false;

  return resultPhoneValidate.isValid;
};

/**
 * Validate phone
 *
 * @param phone
 * @param zipCode
 * @param country
 * @returns
 */
export const validatePhone = (phone: string, zipCode = '+84', country = 'VN') => {
  const isValid = isPhoneValid(zipCode, phone, country);

  if (!isValid) throw new BadRequestException('Invalid phone.');

  return isValid;
};
