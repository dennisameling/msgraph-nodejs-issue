# How to test

1. Install NodeJS 12 or later
1. Copy `.env.dist` to `.env` and set the Client ID, Client Secret, and Tenant ID [as described in the Azure AD docs](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow#first-case-access-token-request-with-a-shared-secret) (can be either Azure AD or Azure AD B2C)
1. Run `npm install`
1. Run `npm start`
1. Open your browser and navigate to `http://localhost:3000/users/{ID}`, where `{ID}` is a UUID of a user that actually exists in Azure AD (B2C). You should see the user's `displayName` in the response 🚀
