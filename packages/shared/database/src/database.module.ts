import { Module, Global, DynamicModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PrismaService } from "./prisma.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({})
export class DatabaseModule {
  static forRootAsync(options: { imports?: any[]; useFactory: (...args: any[]) => Promise<any> | any; inject?: any[]; }): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: options.imports,
          useFactory: async (configService: ConfigService) => {
            return {
              uri: configService.get<string>("MONGODB_URI"),
              autoIndex: process.env.NODE_ENV !== "production",
              retryAttempts: 3,
              retryDelay: 1000,
            };
          },
          inject: options.inject,
        }),
        ConfigModule.forRoot({ isGlobal: true }),
      ],
      providers: [PrismaService],
      exports: [PrismaService, MongooseModule],
    };
  }
}
