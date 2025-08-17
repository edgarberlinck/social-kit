import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Add this import
import { DatabaseModule } from '@social-kit/database'; // Add this import
import { KafkaModule } from './kafka/kafka.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Empty imports for testing
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}