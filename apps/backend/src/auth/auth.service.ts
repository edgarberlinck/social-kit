import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
// import {
//   Post,
//   PostDocument,
//   InjectModel,
//   mongoose,
// } from '@social-kit/database';
@Injectable()
export class AuthService {
  constructor(
    // @InjectModel(Post.name) private postModel: mongoose.Model<PostDocument>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async registerUser(
    registerUserDto: RegisterUserDto,
  ): Promise<{ email: string }> {
    // const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
    // const emailConfirmationToken = uuidv4();
    // try {
    //   const user = await newUser.save();
    //   const activationLink = `http://localhost:3000/auth/activate?token=${emailConfirmationToken}&email=${user.email}`;
    //   await this.emailService.sendEmail(
    //     user.email,
    //     'Activate your account',
    //     `Please activate your account by clicking on this link: ${activationLink}`,
    //   );
    //   return user;
    // } catch (error: any) {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //   if (error.code === 11000) {
    //     // Duplicate key error
    //     throw new ConflictException('Email already registered');
    //   }
    //   throw error;
    // }
    return { email: 'user@mail.com' };
  }

  async activateAccount(email: string, token: string): Promise<boolean> {
    // const user = await this.userModel
    //   .findOne({ email, emailConfirmationToken: token })
    //   .exec();

    // if (!user) {
    //   return false;
    // }

    // user.isEmailConfirmed = true;
    // user.emailConfirmationToken = null;
    // await user.save();

    return true;
  }

  async findUserByEmail(email: string): Promise<null> {
    //return this.userModel.findOne({ email }).exec();
    return null;
  }

  async login(loginUserDto: LoginUserDto) {
    // const user = await this.findUserByEmail(loginUserDto.email);

    // if (!user) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }

    // const isPasswordValid = await bcrypt.compare(
    //   loginUserDto.password,
    //   user.password,
    // );

    // if (!isPasswordValid) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }

    // if (!user.isEmailConfirmed) {
    //   throw new UnauthorizedException('Please confirm your email address');
    // }

    // const payload = {
    //   email: user.email,
    //   sub: user._id,
    //   fullName: user.fullName,
    // };
    return {
      access_token: 'invalid!',
    };
  }
}
