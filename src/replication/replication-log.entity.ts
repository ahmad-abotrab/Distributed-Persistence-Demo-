import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export type ReplicationOperationType = 'INSERT' | 'UPDATE' | 'DELETE';
export type ReplicationStatus = 'PENDING' | 'PROCESSED' | 'FAILED';

@Entity('replication_logs')
export class ReplicationLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    entityType!: string;

    @Column()
    entityId!: number;

    @Column({ length: 20 })
    operationType!: ReplicationOperationType;

    @Column({ type: 'json' })
    payload!: Record<string, any>;

    @Column({ length: 20, default: 'PENDING' })
    status!: ReplicationStatus;

    @Column({ type: 'text', nullable: true })
    errorMessage!: string | null;

    @Column({ type: 'datetime', nullable: true })
    processedAt!: Date | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}