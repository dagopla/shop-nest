import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

})
export class PersistenceModule {
    static foorRoot(settings: any): DynamicModule {
        return {
            module: PersistenceModule,
            imports: [
                ConfigModule.forRoot(settings),
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.DB_HOST,
                    port: +process.env.DB_PORT ,
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    entities: [__dirname + '/entities/*.entity{.ts,.js}'],
                    autoLoadEntities: true,
                    synchronize: true,
                  }),
            ],
            exports: [
                ConfigModule,
                TypeOrmModule,
            ]

        }
    }
}
