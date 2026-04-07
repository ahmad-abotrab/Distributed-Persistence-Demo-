import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
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
            retryCount: 0,
            maxRetries: 3,
            nextRetryAt: null,
        });

        return await this.replicationLogRepository.save(log);
    }

    async findLogsReadyForProcessing() {
        const now = new Date();

        return await this.replicationLogRepository.find({
            where: [
                { status: 'PENDING' },
                {
                    status: 'FAILED',
                    nextRetryAt: LessThanOrEqual(now),
                },
            ],
            order: { id: 'ASC' },
        });
    }
}