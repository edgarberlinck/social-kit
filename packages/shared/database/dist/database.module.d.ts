import { DynamicModule } from '@nestjs/common';
export declare class DatabaseModule {
    static forRoot(uri: string): DynamicModule;
}
