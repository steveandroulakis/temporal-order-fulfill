import fs from 'fs/promises';
import path from 'path';
import { Connection, Client } from '@temporalio/client';
import { runWorkflows, getDefaultOrders } from './starter';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import type { Order, OrderItem } from './interfaces/order';
import { NativeConnection } from '@temporalio/worker';
import { Env, getEnv } from './interfaces/env';

/**
 * Schedule a Workflow connecting with mTLS, configuration is provided via environment variables.
 * Note that serverNameOverride and serverRootCACertificate are optional.
 *
 * If using Temporal Cloud, omit the serverRootCACertificate so that Node.js defaults to using
 * Mozilla's publicly trusted list of CAs when verifying the server certificate.
 */
async function run({
  address,
  namespace,
  clientCertPath,
  clientKeyPath,
  serverNameOverride,
  serverRootCACertificatePath,
  taskQueue,
}: Env, numOrders?: number, invalidPercentage?: number) {
  // Note that the serverRootCACertificate is NOT needed if connecting to Temporal Cloud because
  // the server certificate is issued by a publicly trusted CA.
  let client: Client;
  let connection: Connection | NativeConnection;

  if (clientCertPath && clientKeyPath) {
    // mTLS configuration
    const serverRootCACertificate = serverRootCACertificatePath
      ? await fs.readFile(serverRootCACertificatePath)
      : undefined;

    connection = await Connection.connect({
      address,
      tls: {
        serverNameOverride,
        serverRootCACertificate,
        clientCertPair: {
          crt: await fs.readFile(clientCertPath),
          key: await fs.readFile(clientKeyPath),
        },
      },
    });
  }
  else {
    console.log(`Using unencrypted connection`);
    connection = await Connection.connect({ address: address });
  }

  // Generate orders
  const orders = numOrders && invalidPercentage !== undefined 
    ? generateOrders(numOrders, invalidPercentage) 
    : getDefaultOrders();

  client = new Client({ connection, namespace });
  await runWorkflows(client, taskQueue, orders);
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOrders(count: number, invalidPercentage: number): Order[] {
  const stockDatabasePath = path.resolve(__dirname, '../data/stock_database.json');
  const stockData = require(stockDatabasePath);
  const orders: Order[] = [];
  const numInvalidOrders = Math.floor((invalidPercentage / 100) * count);

  for (let i = 0; i < count; i++) {
    const numItems = getRandomInt(1, 3);
    const items: OrderItem[] = [];

    for (let j = 0; j < numItems; j++) {
      const itemIndex = getRandomInt(0, stockData.length - 1);
      const item = stockData[itemIndex];
      items.push({
        itemName: item.itemName,
        itemPrice: item.itemPrice,
        quantity: getRandomInt(1, 3),
      });
    }

    const order: Order = {
      items: items,
      payment: {
        creditCard: {
          number: "1234 5678 1234 5678",
          expiration: "12/25"
        }
      }
    };

    if (i < numInvalidOrders) {
      makeOrderInvalid(order);
    }

    orders.push(order);
  }

  return orders;
}

function makeOrderInvalid(order: Order): void {
  // Append @@@ to one of the item names to make them invalid
  if (order.items.length > 0) {
    order.items[0].itemName += "@@@";
  }
}

const argv = yargs(hideBin(process.argv)).options({
  numOrders: { type: 'number', alias: 'n' },
  invalidPercentage: { type: 'number', alias: 'i' }
}).argv as { numOrders?: number, invalidPercentage?: number };

run(getEnv(), argv.numOrders, argv.invalidPercentage).then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
