import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ReplicationService } from '../replication/replication.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product, 'primary')
        private readonly primaryProductRepository: Repository<Product>,

        @InjectRepository(Product, 'replica')
        private readonly replicaProductRepository: Repository<Product>,

        private readonly replicationService: ReplicationService,
    ) { }

    async create(data: { name: string; price: number; stock: number }) {
        const product = this.primaryProductRepository.create({
            name: data.name,
            price: data.price,
            stock: data.stock,
        });

        const savedProduct = await this.primaryProductRepository.save(product);

        await this.replicationService.logChange({
            entityType: 'Product',
            entityId: savedProduct.id,
            operationType: 'INSERT',
            payload: {
                id: savedProduct.id,
                name: savedProduct.name,
                price: savedProduct.price,
                stock: savedProduct.stock,
                createdAt: savedProduct.createdAt,
                updatedAt: savedProduct.updatedAt,
            },
        });

        return savedProduct;
    }

    async findAllFromReplica() {
        return await this.replicaProductRepository.find({
            order: { id: 'DESC' },
        });
    }

    async findOneFromReplica(id: number) {
        const product = await this.replicaProductRepository.findOne({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found in replica`);
        }

        return product;
    }

    async findOneFromPrimary(id: number) {
        const product = await this.primaryProductRepository.findOne({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found in primary`);
        }

        return product;
    }
}