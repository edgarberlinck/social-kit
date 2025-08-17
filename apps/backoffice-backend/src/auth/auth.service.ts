import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
    const emailConfirmationToken = uuidv4();

    const newUser = new this.userModel({
      ...registerUserDto,
      password: hashedPassword,
      isEmailConfirmed: false,
      emailConfirmationToken,
    });

    try {
      const user = await newUser.save();

      const activationLink = `http://localhost:3000/auth/activate?token=${emailConfirmationToken}&email=${user.email}`;
      await this.emailService.sendEmail(user.email, 'Activate your account', `Please activate your account by clicking on this link: ${activationLink}`);

      return user;
    } catch (error) {
      if (error.code === 11000) { // Duplicate key error
        throw new ConflictException('Email already registered');
      }
      throw error;
    }
  }

  async activateAccount(email: string, token: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email, emailConfirmationToken: token }).exec();

    if (!user) {
      return false;
    }

    user.isEmailConfirmed = true;
    user.emailConfirmationToken = null;
    await user.save();

    return true;
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.findUserByEmail(loginUserDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailConfirmed) {
      throw new UnauthorizedException('Please confirm your email address');
    }

    const payload = { email: user.email, sub: user._id, fullName: user.fullName };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
