# Kafka Message Queue Service

This service implements the messaging backbone for the Translation Platform using Apache Kafka, enabling asynchronous communication between microservices.

## Architecture Overview

### Kafka Cluster
- 2 Kafka brokers for high availability
- ZooKeeper for cluster coordination
- Kafka UI for monitoring and management
- Configurable topic partitions and replication factors

### Topics Structure

#### Translation Service
- `translation-requests`: Incoming translation requests
- `translation-results`: Completed translation results

#### Summary Service
- `summary-requests`: Incoming summarization requests
- `summary-results`: Completed summary results

#### File Service
- `file-upload-events`: File upload notifications
- `file-processing-status`: File processing status updates

#### User Service
- `user-events`: User-related events and notifications

#### System
- `dead-letter-queue`: Failed messages for retry/investigation

## Setup and Configuration

### Prerequisites
- Docker and Docker Compose
- At least 4GB of RAM available for the Kafka cluster

### Running the Service

1. Start the Kafka cluster:
```bash
docker-compose -f docker-compose.kafka.yml up -d
```

2. Initialize topics:
```bash
chmod +x init-topics.sh
./init-topics.sh
```

3. Access Kafka UI:
```
http://localhost:8080
```

## Topic Configuration

### Default Settings
- Partitions: 3 (for parallel processing)
- Replication Factor: 2 (for fault tolerance)
- Retention Period: 7 days (configurable)

### Specific Topics Configuration
See `topics-config.yml` for detailed configuration of each topic.

## Monitoring and Management

### Kafka UI Features
- Topic management
- Consumer group tracking
- Message browsing
- Performance metrics
- Cluster health monitoring

### Health Checks
- ZooKeeper health check every 10s
- Kafka broker health checks every 30s

## Security

### Network Security
- Internal network isolation
- Configurable listener protocols
- Port exposure control

### Data Security
- Replication for data durability
- Configurable retention policies
- Message validation

## Integration Guidelines

### Producer Services
```javascript
const kafka = new Kafka({
  clientId: 'service-name',
  brokers: ['kafka-1:9092', 'kafka-2:9093']
});

const producer = kafka.producer();
await producer.send({
  topic: 'topic-name',
  messages: [{ value: JSON.stringify(message) }]
});
```

### Consumer Services
```javascript
const consumer = kafka.consumer({ groupId: 'service-group' });
await consumer.subscribe({ topic: 'topic-name' });
await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    // Process message
  },
});
```

## Scaling

### Horizontal Scaling
- Add more Kafka brokers
- Increase topic partitions
- Add consumer group members

### Performance Tuning
- Adjust retention periods
- Configure batch sizes
- Optimize partition count

## Troubleshooting

### Common Issues
1. Topic not available
   - Check broker health
   - Verify topic creation
   - Check replication status

2. Consumer lag
   - Monitor consumer group health
   - Check processing bottlenecks
   - Consider scaling consumers

3. Producer timeouts
   - Verify broker connectivity
   - Check network latency
   - Adjust timeout settings

## Backup and Recovery

### Backup Strategies
- Topic replication
- Regular configuration backups
- Log retention policies

### Disaster Recovery
- Multi-broker setup
- Automated health checks
- Failover procedures
