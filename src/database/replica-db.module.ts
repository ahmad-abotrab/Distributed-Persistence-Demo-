import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'replica',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('REPLICA_DB_HOST'),
        port: config.get<number>('REPLICA_DB_PORT'),
        username: config.get<string>('REPLICA_DB_USERNAME'),
        password: config.get<string>('REPLICA_DB_PASSWORD'),
        database: config.get<string>('REPLICA_DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class ReplicaDbModule {}