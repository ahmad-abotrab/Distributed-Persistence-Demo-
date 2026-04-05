import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrimaryDbModule } from './database/primary-db.module';
import { ReplicaDbModule } from './database/replica-db.module';
import { ProductsModule } from './products/products.module';
import { ReplicationModule } from './replication/replication.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrimaryDbModule,
    ReplicaDbModule,
    ProductsModule,
    ReplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
