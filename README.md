# NestJS Data Replication Demo

A practical demo project that implements `read/write splitting` in the `persistence layer` using `NestJS`, `TypeORM`, and `MySQL`.

The system writes data to a `primary database`, reads data from a `replica database`, and uses an `application-level replication` flow based on `ReplicationLog` and a background `ReplicationWorker`.

## Current Features

- `primary` and `replica` database separation
- separate `TypeORM DataSource` connections
- `Product` entity mapped to both databases
- `write operations` go to `primary`
- `read operations` go to `replica`
- `ReplicationLog` table records data changes
- `ReplicationWorker` processes `PENDING` logs asynchronously
- support for `INSERT` replication
- support for `UPDATE` replication
- `FAILED` replication state handling
- clear demonstration of `eventual consistency`

## Implemented Flow

### Create flow
1. create product in `primary`
2. write a new `ReplicationLog` record with status `PENDING`
3. `ReplicationWorker` reads pending logs
4. worker inserts the product into `replica`
5. log status becomes `PROCESSED`

### Update flow
1. update product in `primary`
2. create `UPDATE` log in `ReplicationLog`
3. worker processes the update
4. product is updated in `replica`
5. log status becomes `PROCESSED`

## Failure Scenario

If an `UPDATE` reaches the worker but the related product does not exist in `replica`, the replication process fails intentionally:

- log status becomes `FAILED`
- `errorMessage` is stored
- the issue becomes visible and traceable

This behavior is useful to demonstrate `replication inconsistency`, `missing replica state`, and the need for `retry` and `recovery strategies`.

## Main Concepts Demonstrated

- `Persistence Layer Separation`
- `Primary-Replica Pattern`
- `Read/Write Splitting`
- `Asynchronous Replication`
- `Replication Lag`
- `Eventual Consistency`
- `Failure Tracking`

## Next Steps

- add `retry mechanism`
- add `versioning`
- add `DELETE` replication
- add `recovery from primary snapshot`
- add monitoring endpoints