import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Strategy, ExtractJwt } from 'passport-jwt'

import { JwtPayload } from './jwt-payload.interface'
import { UserRepository } from './user.repository'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'meow'
    })
  }

  async validate(payload: JwtPayload) {
    const { login } = payload
    const user = await this.userRepository.findOne({ login })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
