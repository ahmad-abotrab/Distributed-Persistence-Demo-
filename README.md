# NestJS Data Replication Demo

A simple demo project that shows how to implement `read/write splitting` in the `persistence layer` using `NestJS` and `MySQL`.

The application writes data to a `primary database` and reads data from a `replica database` through separate `TypeORM connections`. This project is designed to explain the core ideas behind `Primary-Replica Architecture`, `Eventual Consistency`, and `application-level replication`.

## Current scope

- `write operations` go to `primary`
- `read operations` go to `replica`
- separate `DataSource` configuration for each database
- local learning setup without Docker
- foundation for adding `ReplicationLog` and `ReplicationWorker`

## Goal

The goal of this project is to understand the practical and theoretical side of:

- `Persistence Layer Separation`
- `Read/Write Splitting`
- `Primary-Replica Pattern`
- `Replication Lag`
- `Eventual Consistency`