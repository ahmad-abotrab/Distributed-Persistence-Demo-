import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'primary',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('PRIMARY_DB_HOST'),
        port: config.get<number>('PRIMARY_DB_PORT'),
        username: config.get<string>('PRIMARY_DB_USERNAME'),
        password: config.get<string>('PRIMARY_DB_PASSWORD'),
        database: config.get<string>('PRIMARY_DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class PrimaryDbModule {}