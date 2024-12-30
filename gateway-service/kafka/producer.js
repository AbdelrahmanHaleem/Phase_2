const KafkaWrapper = require('../../kafka-service/utils/kafka');

class GatewayProducer {
    constructor() {
        this.kafka = new KafkaWrapper('gateway-service');
        this.producer = null;
    }

    async init() {
        this.producer = await this.kafka.createProducer();
    }

    async sendTranslationRequest(request) {
        const message = await this.kafka.createTopicMessage('translation-requests', {
            id: request.id,
            userId: request.userId,
            text: request.text,
            sourceLanguage: request.sourceLanguage,
            targetLanguage: request.targetLanguage,
            timestamp: Date.now()
        });
        await this.producer.send(message);
    }

    async sendSummarizationRequest(request) {
        const message = await this.kafka.createTopicMessage('summarization-requests', {
            id: request.id,
            userId: request.userId,
            text: request.text,
            type: request.summaryType,
            timestamp: Date.now()
        });
        await this.producer.send(message);
    }

    async shutdown() {
        if (this.producer) {
            await this.producer.disconnect();
        }
    }
}

module.exports = GatewayProducer;
