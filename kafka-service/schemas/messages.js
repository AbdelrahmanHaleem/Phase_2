const producer = new GatewayProducer();
await producer.init();
await producer.sendTranslationRequest({
    id: 'req123',
    userId: 'user123',
    text: 'Hello world',
    sourceLanguage: 'en',
    targetLanguage: 'es'
});const handler = new TranslationHandler();
await handler.init();
// Will automatically start processing messagesconst Joi = require('joi');

// Translation Request Schema
const translationRequestSchema = Joi.object({
    request_id: Joi.string().uuid().required(),
    user_id: Joi.string().required(),
    source_language: Joi.string().length(2).required(),
    target_language: Joi.string().length(2).required(),
    text: Joi.string().max(10000).required(),
    timestamp: Joi.number().timestamp().required(),
    metadata: Joi.object({
        priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
        callback_url: Joi.string().uri().optional()
    }).optional()
});

// Translation Response Schema
const translationResponseSchema = Joi.object({
    request_id: Joi.string().uuid().required(),
    user_id: Joi.string().required(),
    translated_text: Joi.string().required(),
    source_language: Joi.string().length(2).required(),
    target_language: Joi.string().length(2).required(),
    processing_time: Joi.number().required(),
    timestamp: Joi.number().timestamp().required(),
    status: Joi.string().valid('success', 'error').required(),
    error: Joi.object({
        code: Joi.string(),
        message: Joi.string()
    }).optional()
});

// Summarization Request Schema
const summarizationRequestSchema = Joi.object({
    request_id: Joi.string().uuid().required(),
    user_id: Joi.string().required(),
    text: Joi.string().max(50000).required(),
    summary_type: Joi.string().valid('short', 'detailed').required(),
    max_length: Joi.number().optional(),
    timestamp: Joi.number().timestamp().required(),
    metadata: Joi.object({
        priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
        callback_url: Joi.string().uri().optional()
    }).optional()
});

// Summarization Response Schema
const summarizationResponseSchema = Joi.object({
    request_id: Joi.string().uuid().required(),
    user_id: Joi.string().required(),
    summarized_text: Joi.string().required(),
    original_length: Joi.number().required(),
    summary_length: Joi.number().required(),
    processing_time: Joi.number().required(),
    timestamp: Joi.number().timestamp().required(),
    status: Joi.string().valid('success', 'error').required(),
    error: Joi.object({
        code: Joi.string(),
        message: Joi.string()
    }).optional()
});

module.exports = {
    translationRequestSchema,
    translationResponseSchema,
    summarizationRequestSchema,
    summarizationResponseSchema
};
