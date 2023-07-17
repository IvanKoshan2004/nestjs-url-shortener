import { Injectable } from '@nestjs/common';
import { AuthBasicGuard } from './auth-basic.guard';

@Injectable()
export class AuthUserGuard extends AuthBasicGuard {}
