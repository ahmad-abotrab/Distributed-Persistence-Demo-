import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplicationService } from './replication.service';
import { ReplicationLog } from './replication-log.entity';
import { Product } from 'src/products/product.entity';
import { ReplicationWorker } from './replication.worker';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReplicationLog], 'primary'),
    TypeOrmModule.forFeature([Product], 'replica'),
  ],
  providers: [ReplicationService, ReplicationWorker],
  exports: [ReplicationService],
})
export class ReplicationModule { }