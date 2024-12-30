const {
    translationRequestSchema,
    summarizationRequestSchema,
    userEventSchema
} = require('../../kafka-service/schemas/messages');

class MessageProcessor {
    constructor(kafkaProducer, logger) {
        this.producer = kafkaProducer;
        this.logger = logger;
        this.topics = {
            translation: {
                request: 'translation-requests',
                response: 'translation-responses'
            },
            summarization: {
                request: 'summarization-requests',
                response: 'summarization-responses'
            },
            userEvents: 'user-events',
            systemMetrics: 'system-metrics'
        };
        this.pendingRequests = new Map();
    }

    // Helper method to format timestamp in ISO 8601
    formatTimestamp(date = new Date()) {
        return date.toISOString();
    }

    // Helper method to serialize message to JSON with error handling
    serializeMessage(message) {
        try {
            return JSON.stringify(message);
        } catch (error) {
            this.logger.error('Message serialization failed', {
                error: error.message,
                messageType: message?.type
            });
            throw new Error('Failed to serialize message');
        }
    }

    // Helper method to deserialize message from JSON with error handling
    deserializeMessage(message) {
        try {
            return JSON.parse(message);
        } catch (error) {
            this.logger.error('Message deserialization failed', {
                error: error.message
            });
            throw new Error('Failed to deserialize message');
        }
    }

    async processTranslationRequest(req) {
        try {
            const timestamp = this.formatTimestamp();
            
            // Validate and format request message
            const messageData = {
                request_id: req.id,
                user_id: req.userId,
                source_language: req.sourceLang,
                target_language: req.targetLang,
                text: req.text,
                timestamp,
                metadata: {
                    priority: req.priority || 'medium',
                    callback_url: req.callbackUrl
                }
            };

            // Validate request against schema
            const validatedRequest = await translationRequestSchema.validateAsync(messageData);

            // Log request
            this.logger.info('Translation request received', {
                requestId: validatedRequest.request_id,
                userId: validatedRequest.user_id,
                sourceLang: validatedRequest.source_language,
                targetLang: validatedRequest.target_language,
                timestamp: validatedRequest.timestamp
            });

            // Serialize and send to Kafka
            const serializedMessage = this.serializeMessage(validatedRequest);
            await this.producer.send({
                topic: this.topics.translation.request,
                messages: [{
                    key: validatedRequest.request_id,
                    value: serializedMessage,
                    timestamp
                }]
            });

            // Track request and return promise
            return this.trackRequest(validatedRequest.request_id);
        } catch (error) {
            this.logger.error('Error processing translation request', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    async processSummarizationRequest(req) {
        try {
            const timestamp = this.formatTimestamp();
            
            // Validate and format request message
            const messageData = {
                request_id: req.id,
                user_id: req.userId,
                text: req.text,
                summary_type: req.summaryType,
                max_length: req.maxLength,
                timestamp,
                metadata: {
                    priority: req.priority || 'medium',
                    callback_url: req.callbackUrl
                }
            };

            // Validate request against schema
            const validatedRequest = await summarizationRequestSchema.validateAsync(messageData);

            // Log request
            this.logger.info('Summarization request received', {
                requestId: validatedRequest.request_id,
                userId: validatedRequest.user_id,
                summaryType: validatedRequest.summary_type,
                timestamp: validatedRequest.timestamp
            });

            // Serialize and send to Kafka
            const serializedMessage = this.serializeMessage(validatedRequest);
            await this.producer.send({
                topic: this.topics.summarization.request,
                messages: [{
                    key: validatedRequest.request_id,
                    value: serializedMessage,
                    timestamp
                }]
            });

            // Track request and return promise
            return this.trackRequest(validatedRequest.request_id);
        } catch (error) {
            this.logger.error('Error processing summarization request', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    async publishUserEvent(event) {
        try {
            const timestamp = this.formatTimestamp();
            
            const validatedEvent = await userEventSchema.validateAsync({
                event_id: event.id,
                user_id: event.userId,
                event_type: event.type,
                timestamp,
                details: event.details
            });

            const serializedEvent = this.serializeMessage(validatedEvent);
            await this.producer.send({
                topic: this.topics.userEvents,
                messages: [{
                    key: event.userId,
                    value: serializedEvent,
                    timestamp
                }]
            });

            this.logger.info('User event published', {
                eventId: validatedEvent.event_id,
                userId: validatedEvent.user_id,
                type: validatedEvent.event_type,
                timestamp: validatedEvent.timestamp
            });
        } catch (error) {
            this.logger.error('Error publishing user event', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    async publishSystemMetric(metric) {
        try {
            const timestamp = this.formatTimestamp();
            
            const serializedMetric = this.serializeMessage({
                metric_name: metric.name,
                value: metric.value,
                timestamp,
                labels: metric.labels || {},
                service: 'gateway-service'
            });
            await this.producer.send({
                topic: this.topics.systemMetrics,
                messages: [{
                    key: metric.name,
                    value: serializedMetric,
                    timestamp
                }]
            });

            this.logger.debug('System metric published', {
                metricName: metric.name,
                value: metric.value,
                timestamp
            });
        } catch (error) {
            this.logger.error('Error publishing system metric', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    async handleTranslationResponse(message) {
        try {
            // Deserialize and validate response
            const response = this.deserializeMessage(message.value);
            const { request_id, translated_text, timestamp, error } = response;

            this.logger.info('Translation response received', {
                requestId: request_id,
                hasError: !!error,
                timestamp
            });

            const pendingRequest = this.pendingRequests.get(request_id);
            if (!pendingRequest) {
                this.logger.warn('Received response for unknown request', {
                    requestId: request_id,
                    timestamp
                });
                return;
            }

            if (error) {
                this.logger.error('Translation service reported error', {
                    requestId: request_id,
                    error,
                    timestamp
                });
                pendingRequest.reject(new Error(error));
            } else {
                pendingRequest.resolve({
                    request_id,
                    translated_text,
                    timestamp,
                    status: 'completed'
                });
            }

            this.pendingRequests.delete(request_id);

            // Publish metric for monitoring
            await this.publishSystemMetric({
                name: 'translation_request_completed',
                value: 1,
                labels: {
                    request_id,
                    status: error ? 'error' : 'success',
                    response_time: Date.now() - new Date(pendingRequest.timestamp).getTime()
                }
            });
        } catch (error) {
            this.logger.error('Error handling translation response', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    async handleSummarizationResponse(message) {
        try {
            // Deserialize and validate response
            const response = this.deserializeMessage(message.value);
            const { request_id, summarized_text, timestamp, error } = response;

            this.logger.info('Summarization response received', {
                requestId: request_id,
                hasError: !!error,
                timestamp
            });

            const pendingRequest = this.pendingRequests.get(request_id);
            if (!pendingRequest) {
                this.logger.warn('Received response for unknown request', {
                    requestId: request_id,
                    timestamp
                });
                return;
            }

            if (error) {
                this.logger.error('Summarization service reported error', {
                    requestId: request_id,
                    error,
                    timestamp
                });
                pendingRequest.reject(new Error(error));
            } else {
                pendingRequest.resolve({
                    request_id,
                    summarized_text,
                    timestamp,
                    status: 'completed'
                });
            }

            this.pendingRequests.delete(request_id);

            // Publish metric for monitoring
            await this.publishSystemMetric({
                name: 'summarization_request_completed',
                value: 1,
                labels: {
                    request_id,
                    status: error ? 'error' : 'success',
                    response_time: Date.now() - new Date(pendingRequest.timestamp).getTime()
                }
            });
        } catch (error) {
            this.logger.error('Error handling summarization response', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    // Handle errors and retries
    async handleFailedMessage(message, error) {
        this.logger.error('Message processing failed', {
            messageId: message.id,
            error: error.message
        });

        // Implement retry logic or dead letter queue handling
        if (message.retryCount < 3) {
            // Retry with exponential backoff
            const delay = Math.pow(2, message.retryCount) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            
            return {
                shouldRetry: true,
                retryCount: message.retryCount + 1
            };
        }

        // Move to dead letter queue after max retries
        await this.producer.sendToDeadLetterQueue({
            originalMessage: message,
            error: error.message,
            failedAttempts: message.retryCount
        });

        return { shouldRetry: false };
    }

    // Track pending request and return a promise that will resolve with the response
    trackRequest(requestId, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                this.pendingRequests.delete(requestId);
                reject(new Error('Request timed out'));
            }, timeout);

            this.pendingRequests.set(requestId, {
                resolve: (result) => {
                    clearTimeout(timeoutId);
                    resolve(result);
                },
                reject: (error) => {
                    clearTimeout(timeoutId);
                    reject(error);
                },
                timestamp: Date.now()
            });
        });
    }
}

module.exports = MessageProcessor;
