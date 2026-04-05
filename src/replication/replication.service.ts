import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReplicationLog, ReplicationOperationType } from './replication-log.entity';

@Injectable()
export class ReplicationService {
    constructor(
        @InjectRepository(ReplicationLog, 'primary')
        private readonly replicationLogRepository: Repository<ReplicationLog>,
    ) { }

    async logChange(params: {
        entityType: string;
        entityId: number;
        operationType: ReplicationOperationType;
        payload: Record<string, any>;
    }) {
        const log = this.replicationLogRepository.create({
            entityType: params.entityType,
            entityId: params.entityId,
            operationType: params.operationType,
            payload: params.payload,
            status: 'PENDING',
            errorMessage: null,
            processedAt: null,
        });

        return await this.replicationLogRepository.save(log);
    }

    async findPendingLogs() {
        return await this.replicationLogRepository.find({
            where: { status: 'PENDING' },
            order: { id: 'ASC' },
        });
    }
}