import { Request, Response } from 'express';



import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';



import { User } from '../user/types';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { RegisterInput } from './dto/register.input';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';

interface RequestWithUser extends Request {
  user: Omit<User, 'password'>;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterInput,
  ): Promise<{ message: string }> {
    return this.authService.register(registerDto);
  }

  @Post('resend-verification')
  async resendVerificationEmail(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    return this.authService.resendVerificationEmail(email);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    return this.authService.login(req.user, response);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(): Promise<void> {
    // Google OAuth 시작
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.handleOAuthLogin(
      req.user,
      'google',
      res,
      req.user.accessToken,
      req.user.refreshToken,
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubAuth(): Promise<void> {
    // GitHub OAuth 시작
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubAuthCallback(
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.handleOAuthLogin(
      req.user,
      'github',
      res,
      req.user.accessToken,
      req.user.refreshToken,
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
  }

  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    return this.authService.verifyEmail(token);
  }

  @UseGuards(SessionAuthGuard)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    return this.authService.logout(response);
  }

  @UseGuards(SessionAuthGuard)
  @Get('check-session')
  async checkSession(): Promise<boolean> {
    return true;
  }
}