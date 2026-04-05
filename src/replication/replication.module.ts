import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplicationService } from './replication.service';
import { ReplicationLog } from './replication-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReplicationLog], 'primary')],
  providers: [ReplicationService],
  exports: [ReplicationService],
})
export class ReplicationModule { }