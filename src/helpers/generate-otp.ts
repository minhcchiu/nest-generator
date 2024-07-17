export const generateOTP = (length = 4) => {
  const digits = "0123456789";

  let otp = "";

  for (let i = 1; i <= length; i++) {
    const index = Math.floor(Math.random() * digits.length);

    otp = otp + digits[index];
  }

  return otp;
};
