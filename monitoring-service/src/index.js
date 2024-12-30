const express = require('express');
const { Kafka } = require('kafkajs');
const { MongoClient } = require('mongodb');
const promClient = require('prom-client');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
});

// Initialize Prometheus metrics
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Custom metrics
const translationRequestCounter = new promClient.Counter({
    name: 'translation_requests_total',
    help: 'Total number of translation requests',
    labelNames: ['source_language', 'target_language', 'status']
});

const summarizationRequestCounter = new promClient.Counter({
    name: 'summarization_requests_total',
    help: 'Total number of summarization requests',
    labelNames: ['status']
});

const requestLatencyHistogram = new promClient.Histogram({
    name: 'request_latency_seconds',
    help: 'Request latency in seconds',
    labelNames: ['service', 'operation']
});

register.registerMetric(translationRequestCounter);
register.registerMetric(summarizationRequestCounter);
register.registerMetric(requestLatencyHistogram);

// Initialize Kafka client
const kafka = new Kafka({
    clientId: 'monitoring-service',
    brokers: process.env.KAFKA_BROKERS.split(',')
});

const consumer = kafka.consumer({ groupId: 'monitoring-group' });

// Initialize MongoDB client
const mongoClient = new MongoClient(process.env.MONGODB_URI);

async function startMonitoring() {
    try {
        // Connect to MongoDB
        await mongoClient.connect();
        logger.info('Connected to MongoDB');

        // Connect to Kafka
        await consumer.connect();
        logger.info('Connected to Kafka');

        // Subscribe to topics
        await consumer.subscribe({ topics: ['translation-requests', 'translation-responses', 'summarization-requests', 'summarization-responses', 'user-events'] });

        // Start consuming messages
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                const value = JSON.parse(message.value.toString());
                
                // Store event in MongoDB
                const db = mongoClient.db('monitoring');
                await db.collection('events').insertOne({
                    topic,
                    message: value,
                    timestamp: new Date()
                });

                // Update metrics based on message type
                switch (topic) {
                    case 'translation-requests':
                        translationRequestCounter.inc({
                            source_language: value.source_language,
                            target_language: value.target_language,
                            status: 'received'
                        });
                        break;
                    case 'translation-responses':
                        translationRequestCounter.inc({
                            source_language: value.source_language,
                            target_language: value.target_language,
                            status: value.error ? 'failed' : 'completed'
                        });
                        break;
                    case 'summarization-requests':
                        summarizationRequestCounter.inc({ status: 'received' });
                        break;
                    case 'summarization-responses':
                        summarizationRequestCounter.inc({ status: value.error ? 'failed' : 'completed' });
                        break;
                }
            }
        });
    } catch (error) {
        logger.error('Error in monitoring service', { error: error.message });
        process.exit(1);
    }
}

// Create Express app for metrics endpoint
const app = express();

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (error) {
        res.status(500).end(error.message);
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Start the server
const port = process.env.METRICS_PORT || 9090;
app.listen(port, () => {
    logger.info(`Metrics server listening on port ${port}`);
});

// Start monitoring
startMonitoring().catch(error => {
    logger.error('Failed to start monitoring', { error: error.message });
    process.exit(1);
});
