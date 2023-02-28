import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { AuthService } from './auth.service';

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(MagicLoginStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      secret: configService.getOrThrow('JWT_SECRET'), // get this from env vars
      jwtOptions: {
        expiresIn: '5m',
      },
      callbackUrl: `${configService.getOrThrow(
        'MAGIC_CALLBACK_URL_PREFIX',
      )}/auth/login/callback`,
      sendMagicLink: async (destination, href) => {
        // TODO: send email
        this.logger.debug(`sending email to ${destination} with link ${href}`);
      },
      verify: async (payload, callback) => {
        callback(null, this.validate(payload));
      },
    });
  }
  validate(payload: { destination: string }) {
    // validate email, user of application
    const user = this.authService.validateUser(payload.destination);

    return user;
  }
}
