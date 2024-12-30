const { Kafka } = require('kafkajs');

class KafkaWrapper {
    constructor(clientId, brokers = ['kafka-1:9092', 'kafka-2:9093', 'kafka-3:9094']) {
        this.kafka = new Kafka({
            clientId,
            brokers,
            retry: {
                initialRetryTime: 100,
                retries: 8
            }
        });
    }

    async createProducer() {
        const producer = this.kafka.producer();
        await producer.connect();
        return producer;
    }

    async createConsumer(groupId) {
        const consumer = this.kafka.consumer({ groupId });
        await consumer.connect();
        return consumer;
    }

    async createTopicMessage(topic, message) {
        return {
            topic,
            messages: [
                {
                    key: message.id || Date.now().toString(),
                    value: JSON.stringify(message),
                    headers: {
                        timestamp: Date.now().toString(),
                        source: process.env.SERVICE_NAME || 'unknown'
                    }
                }
            ]
        };
    }

    static async handleConsumerMessage(message, handler) {
        try {
            const data = JSON.parse(message.value.toString());
            await handler(data, message.headers);
        } catch (error) {
            console.error('Error processing message:', error);
            // Could implement dead letter queue logic here
        }
    }
}

module.exports = KafkaWrapper;
