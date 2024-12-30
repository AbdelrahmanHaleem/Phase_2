const supertokens = require('supertokens-node');
const Session = require('supertokens-node/recipe/session');
const EmailPassword = require('supertokens-node/recipe/emailpassword');
const EmailVerification = require('supertokens-node/recipe/emailverification');
const Dashboard = require('supertokens-node/recipe/dashboard');

exports.initSupertokens = () => {
    supertokens.init({
        framework: 'express',
        supertokens: {
            connectionURI: process.env.SUPERTOKENS_CONNECTION_URI || 'http://localhost:3567',
            apiKey: process.env.SUPERTOKENS_API_KEY,
        },
        appInfo: {
            appName: 'Translation Platform',
            apiDomain: process.env.API_DOMAIN || 'http://localhost:8003',
            websiteDomain: process.env.FRONTEND_URL || 'http://localhost:3000',
            apiBasePath: '/auth',
            websiteBasePath: '/auth'
        },
        recipeList: [
            EmailVerification.init({
                mode: "REQUIRED"
            }),
            EmailPassword.init({
                signUpFeature: {
                    formFields: [{
                        id: "name",
                        optional: false
                    }]
                },
                override: {
                    apis: (originalImplementation) => {
                        return {
                            ...originalImplementation,
                            signUpPOST: async function (input) {
                                if (originalImplementation.signUpPOST === undefined) {
                                    throw Error("Should never come here");
                                }

                                // First call the original implementation
                                let response = await originalImplementation.signUpPOST(input);

                                if (response.status === "OK") {
                                    // User was successfully created
                                    const { id, email } = response.user;
                                    
                                    // Here you can add custom logic like:
                                    // - Creating a user profile
                                    // - Sending welcome email
                                    // - Adding to mailing list
                                    console.log(`New user signed up: ${email}`);
                                }

                                return response;
                            }
                        };
                    }
                }
            }),
            Session.init({
                cookieDomain: process.env.COOKIE_DOMAIN || 'localhost',
                cookieSecure: process.env.NODE_ENV === 'production',
                cookieSameSite: "lax"
            }),
            Dashboard.init()
        ]
    });
};
