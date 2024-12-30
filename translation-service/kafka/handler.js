const KafkaWrapper = require('../../kafka-service/utils/kafka');

class TranslationHandler {
    constructor() {
        this.kafka = new KafkaWrapper('translation-service');
        this.consumer = null;
        this.producer = null;
    }

    async init() {
        this.consumer = await this.kafka.createConsumer('translation-service-group');
        this.producer = await this.kafka.createProducer();

        await this.consumer.subscribe({
            topic: 'translation-requests',
            fromBeginning: false
        });

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                await this.handleTranslationRequest(message);
            }
        });
    }

    async handleTranslationRequest(message) {
        await KafkaWrapper.handleConsumerMessage(message, async (data) => {
            try {
                // Process translation (implementation details omitted)
                const translatedText = await this.translateText(data);

                // Send response
                const response = await this.kafka.createTopicMessage('translation-responses', {
                    requestId: data.id,
                    userId: data.userId,
                    originalText: data.text,
                    translatedText,
                    sourceLanguage: data.sourceLanguage,
                    targetLanguage: data.targetLanguage,
                    timestamp: Date.now()
                });
                await this.producer.send(response);
            } catch (error) {
                console.error('Translation error:', error);
                // Handle error and potentially send to dead letter queue
            }
        });
    }

    async translateText(data) {
        // Implement actual translation logic here
        return `Translated: ${data.text}`;
    }

    async shutdown() {
        await this.consumer?.disconnect();
        await this.producer?.disconnect();
    }
}

module.exports = TranslationHandler;
