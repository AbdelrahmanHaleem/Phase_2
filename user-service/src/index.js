require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const supertokens = require('supertokens-node');
const { middleware } = require('supertokens-node/framework/express');
const { errorHandler } = require('supertokens-node/framework/express');

const { initSupertokens } = require('./config/supertokens');
const { healthRouter } = require('./routes/health');
const { userRouter } = require('./routes/user');

// Initialize Supertokens
initSupertokens();

const app = express();
const PORT = process.env.PORT || 8003;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
}));
app.use(express.json());

// Supertokens middleware
app.use(middleware());

// Routes
app.use('/health', healthRouter);
app.use('/api/users', userRouter);

// Supertokens error handler
app.use(errorHandler());

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log(`User service listening on port ${PORT}`);
});
