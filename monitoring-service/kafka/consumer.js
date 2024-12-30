const KafkaWrapper = require('../../kafka-service/utils/kafka');

class MonitoringConsumer {
    constructor(metricsHandler) {
        this.kafka = new KafkaWrapper('monitoring-service');
        this.consumer = null;
        this.metricsHandler = metricsHandler;
    }

    async init() {
        this.consumer = await this.kafka.createConsumer('monitoring-service-group');

        // Subscribe to monitoring topics
        await this.consumer.subscribe({
            topics: ['system-metrics', 'user-events'],
            fromBeginning: false
        });

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                await this.handleMetric(topic, message);
            }
        });
    }

    async handleMetric(topic, message) {
        await KafkaWrapper.handleConsumerMessage(message, async (data) => {
            try {
                switch (topic) {
                    case 'system-metrics':
                        await this.metricsHandler.processSystemMetric({
                            timestamp: data.timestamp,
                            service: data.service,
                            metric: data.metric,
                            value: data.value,
                            tags: data.tags
                        });
                        break;

                    case 'user-events':
                        await this.metricsHandler.processUserEvent({
                            timestamp: data.timestamp,
                            userId: data.userId,
                            eventType: data.eventType,
                            details: data.details
                        });
                        break;

                    default:
                        console.warn(`Unhandled metric topic: ${topic}`);
                }
            } catch (error) {
                console.error(`Error processing ${topic} metric:`, error);
            }
        });
    }

    async shutdown() {
        if (this.consumer) {
            await this.consumer.disconnect();
        }
    }
}

module.exports = MonitoringConsumer;
