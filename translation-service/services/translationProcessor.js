const { translationResponseSchema } = require('../../kafka-service/schemas/messages');

class TranslationProcessor {
    constructor(translationService, kafkaProducer, logger) {
        this.translationService = translationService;
        this.producer = kafkaProducer;
        this.logger = logger;
    }

    async processTranslationRequest(message) {
        const startTime = Date.now();
        
        try {
            // Log request receipt
            this.logger.info('Translation request received', {
                requestId: message.request_id,
                sourceLang: message.source_language,
                targetLang: message.target_language
            });

            // Perform translation
            const translatedText = await this.translationService.translate({
                text: message.text,
                sourceLang: message.source_language,
                targetLang: message.target_language
            });

            // Calculate processing time
            const processingTime = Date.now() - startTime;

            // Create response
            const response = await translationResponseSchema.validateAsync({
                request_id: message.request_id,
                user_id: message.user_id,
                translated_text: translatedText,
                source_language: message.source_language,
                target_language: message.target_language,
                processing_time: processingTime,
                timestamp: Date.now(),
                status: 'success'
            });

            // Send response
            await this.producer.send('translation-responses', response);

            // Log success
            this.logger.info('Translation completed successfully', {
                requestId: message.request_id,
                processingTime
            });

            return response;

        } catch (error) {
            // Log error
            this.logger.error('Translation failed', {
                requestId: message.request_id,
                error: error.message,
                stack: error.stack
            });

            // Send error response
            const errorResponse = await translationResponseSchema.validateAsync({
                request_id: message.request_id,
                user_id: message.user_id,
                translated_text: '',
                source_language: message.source_language,
                target_language: message.target_language,
                processing_time: Date.now() - startTime,
                timestamp: Date.now(),
                status: 'error',
                error: {
                    code: error.code || 'TRANSLATION_ERROR',
                    message: error.message
                }
            });

            await this.producer.send('translation-responses', errorResponse);
            return errorResponse;
        }
    }

    // Handle batch processing if supported by translation service
    async processBatch(messages) {
        const results = await Promise.allSettled(
            messages.map(msg => this.processTranslationRequest(msg))
        );

        // Log batch results
        const succeeded = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        this.logger.info('Batch processing completed', {
            total: messages.length,
            succeeded,
            failed
        });

        return results;
    }

    // Implement circuit breaker pattern
    async checkHealth() {
        try {
            await this.translationService.healthCheck();
            return true;
        } catch (error) {
            this.logger.error('Translation service health check failed', {
                error: error.message
            });
            return false;
        }
    }
}

module.exports = TranslationProcessor;
