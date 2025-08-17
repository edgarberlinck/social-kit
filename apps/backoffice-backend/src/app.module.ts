import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Ensure ConfigService is imported
import { DatabaseModule } from '@social-kit/database'; // Add this import
import { KafkaModule } from './kafka/kafka.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017/socialkit',
    ),
    KafkaModule,
    EmailModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
