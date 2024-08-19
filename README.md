# Order fulfill

### Running this sample

The sample is configured by default to connect to a [local Temporal Server](https://docs.temporal.io/cli#starting-the-temporal-server) running on localhost:7233

```
temporal server start-dev
```

To instead connect to Temporal Cloud, set the following environment variables, replacing them with your own Temporal Cloud credentials:

```bash
TEMPORAL_ADDRESS=testnamespace.sdvdw.tmprl.cloud:7233
TEMPORAL_NAMESPACE=testnamespace.sdvdw
TEMPORAL_CLIENT_CERT_PATH="/path/to/file.pem"
TEMPORAL_CLIENT_KEY_PATH="/path/to/file.key"
```

`npm install` to install dependencies.

Run `npm run start` to start the Worker. (You can also get [Nodemon](https://www.npmjs.com/package/nodemon) to watch for changes and restart the worker automatically by running `npm run start.watch`.)
Run `npm run workflow` to run the Workflow.

### Scenarios

See `demo` folder for different scenarios that will be live-coded into `workflows.ts`:

1. Happy path (`demo/workflows1.ts`)
2. API Downtime (uncomment inventory code)
3. Invalid order troubleshooting, set cc expiry in `starter.ts` to `12/23`
4. Human in the loop, send `approveOrder` signal (`demo/workflows2.ts`)
5. Approve or expire order (`demo/workflows3.ts`)
6. Bug in workflow, add `throw Error('workflow bug!')` in workflow code
7. Generate invalid orders `npm run workflow -- --numOrders 50 --invalidPercentage 20` (note the `--` to pass args to the script)
    - This will generate 50 orders with 20% invalid orders
    - Uncomment bug fix in `api.ts` and run again to fix workflows
