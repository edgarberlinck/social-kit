import { Module, Global, DynamicModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PrismaService } from "./prisma.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? "mongodb://root:example@mongo:27017/"
    ),
  ],
  providers: [PrismaService],
  controllers: [],
  exports: [PrismaService, MongooseModule],
})
export class DatabaseModule {}
