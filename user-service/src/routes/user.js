const express = require('express');
const { verifySession } = require('supertokens-node/recipe/session/framework/express');
const { SessionRequest } = require('supertokens-node/framework/express');
const router = express.Router();

// Get user profile
router.get('/me', verifySession(), async (req, res) => {
    const session = req.session;
    try {
        res.json({
            userId: session.getUserId(),
            email: session.getAccessTokenPayload().email,
            // Add any additional user info you want to return
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({
            error: 'Failed to fetch user profile'
        });
    }
});

// Update user profile
router.put('/me', verifySession(), async (req, res) => {
    const session = req.session;
    const { name, preferences } = req.body;

    try {
        // Here you would typically update the user's profile in your database
        // For now, we'll just return the received data
        res.json({
            userId: session.getUserId(),
            name,
            preferences,
            message: 'Profile updated successfully'
        });
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({
            error: 'Failed to update user profile'
        });
    }
});

// Delete user account
router.delete('/me', verifySession(), async (req, res) => {
    const session = req.session;
    try {
        // Here you would typically implement the account deletion logic
        // For now, we'll just return a success message
        await session.revokeSession();
        res.json({
            message: 'Account deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting user account:', err);
        res.status(500).json({
            error: 'Failed to delete user account'
        });
    }
});

exports.userRouter = router;
