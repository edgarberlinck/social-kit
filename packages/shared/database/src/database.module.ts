import { Module, Global, DynamicModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PrismaService } from "./prisma.service";

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(uri: string): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRoot(uri, {
          autoIndex: process.env.NODE_ENV !== "production", // Disable auto-indexing in production
          retryAttempts: 3,
          retryDelay: 1000,
        }),
      ],
      providers: [PrismaService],
      exports: [PrismaService, MongooseModule],
    };
  }
}
