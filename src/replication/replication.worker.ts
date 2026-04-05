import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReplicationLog } from './replication-log.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class ReplicationWorker {
    private readonly logger = new Logger(ReplicationWorker.name);
    private isRunning = false;

    constructor(
        @InjectRepository(ReplicationLog, 'primary')
        private readonly replicationLogRepository: Repository<ReplicationLog>,

        @InjectRepository(Product, 'replica')
        private readonly replicaProductRepository: Repository<Product>,
    ) { }

    @Cron('*/5 * * * * *')
    async handleReplication() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;

        try {
            const pendingLogs = await this.replicationLogRepository.find({
                where: { status: 'PENDING' },
                order: { id: 'ASC' },
            });

            if (pendingLogs.length === 0) {
                return;
            }

            for (const log of pendingLogs) {
                try {
                    await this.processLog(log);

                    log.status = 'PROCESSED';
                    log.processedAt = new Date();
                    log.errorMessage = null;

                    await this.replicationLogRepository.save(log);
                } catch (error) {
                    log.status = 'FAILED';
                    log.errorMessage =
                        error instanceof Error ? error.message : 'Unknown replication error';
                    await this.replicationLogRepository.save(log);

                    this.logger.error(`Failed to process log ${log.id}`, error);
                }
            }
        } finally {
            this.isRunning = false;
        }
    }
    private async processLog(log: ReplicationLog) {
        if (log.entityType !== 'Product') {
            throw new Error(`Unsupported entityType: ${log.entityType}`);
        }

        const payload = log.payload;

        if (log.operationType === 'INSERT') {
            const existing = await this.replicaProductRepository.findOne({
                where: { id: payload.id },
            });

            if (existing) {
                return;
            }

            const product = this.replicaProductRepository.create({
                id: payload.id,
                name: payload.name,
                price: payload.price,
                stock: payload.stock,
                createdAt: payload.createdAt,
                updatedAt: payload.updatedAt,
            });

            await this.replicaProductRepository.save(product);
            return;
        }

        if (log.operationType === 'UPDATE') {
            const existing = await this.replicaProductRepository.findOne({
                where: { id: payload.id },
            });

            if (!existing) {
                throw new Error(`Product with id ${payload.id} not found in replica for update`);
            }

            existing.name = payload.name;
            existing.price = payload.price;
            existing.stock = payload.stock;
            existing.createdAt = payload.createdAt;
            existing.updatedAt = payload.updatedAt;

            await this.replicaProductRepository.save(existing);
            return;
        }

        throw new Error(`Unsupported operationType: ${log.operationType}`);
    }
}