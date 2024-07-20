# Order fulfill

### Running this sample

Set env vars for cloud
```
TEMPORAL_ADDRESS
TEMPORAL_NAMESPACE
TEMPORAL_CLIENT_CERT_PATH
TEMPORAL_CLIENT_KEY_PATH
```

On step 8, run `npm start` to start the Worker.
On step 9, in another shell, enter `npm run workflow` to run the Workflow.

### Scenarios

See `demo` folder for different scenarios that will be live-coded into `workflows.ts`:

1. Happy path (`demo/workflows1.ts`)
2. API Downtime (uncomment inventory code)
3. Invalid order troubleshooting, set cc expiry in `starter.ts` to `12/23`
4. Human in the loop, send `approveOrder` signal (`demo/workflows2.ts`)
5. Approve or expire order (`demo/workflows3.ts`)
6. Bug in workflow, add `throw Error('workflow bug!')` in workflow code