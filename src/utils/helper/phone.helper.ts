import { BadRequestException } from '@nestjs/common';
import { phone } from 'phone';

export const phoneHelper = {
  /**
   * Validate phone
   * @param zipCode
   * @param phoneNumber
   * @param country
   * @returns
   */
  isPhoneValid(
    zipCode: string,
    phoneNumber: string,
    country?: string | undefined,
  ) {
    const resultPhoneValidate = phone(`${zipCode}${phoneNumber}`, { country });

    if (!resultPhoneValidate) return false;

    return resultPhoneValidate.isValid;
  },

  /**
   * Validate phone
   * @param phone
   * @param zipCode
   * @param country
   * @returns
   */
  validatePhone(phone: string, zipCode = '+84', country = 'VN') {
    const isPhoneValid = this.isPhoneValid(zipCode, phone, country);

    if (!isPhoneValid) throw new BadRequestException('Invalid phone.');

    return isPhoneValid;
  },
};
