import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailVerificationRequiredException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Email Verification Required',
        message: '이메일 인증이 필요합니다.',
        code: 'EMAIL_VERIFICATION_REQUIRED',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
