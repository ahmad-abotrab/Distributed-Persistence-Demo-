import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrimaryDbModule } from './database/primary-db.module';
import { ReplicaDbModule } from './database/replica-db.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrimaryDbModule,
    ReplicaDbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
