# How to test

1. Install NodeJS 14, 15 or 16
1. Copy `.env.dist` to `.env` and set the Client ID, Client Secret, and Access Token URL [as described in the Azure AD docs](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow#first-case-access-token-request-with-a-shared-secret) (can be either Azure AD or Azure AD B2C)
1. Run `npm install`
1. Run `npm start`
1. Open your browser and navigate to `http://localhost:3000/users/{ID}`, where `{ID}` is a UUID of a user that actually exists in Azure AD (B2C). You will get the response in <500ms and you can repeat the request multiple times if you want.
1. Wait for ~2 minutes. You'll see the following error pop up in your console:

```console
node:events:342
      throw er; // Unhandled 'error' event
      ^

Error: read ECONNRESET
    at TLSWrap.onStreamRead (node:internal/stream_base_commons:211:20)
Emitted 'error' event on TLSSocket instance at:
    at emitErrorNT (node:internal/streams/destroy:193:8)
    at emitErrorCloseNT (node:internal/streams/destroy:158:3)
    at processTicksAndRejections (node:internal/process/task_queues:83:21) {
  errno: -104,
  code: 'ECONNRESET',
  syscall: 'read'
}
```
