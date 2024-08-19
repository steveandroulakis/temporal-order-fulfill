import {
  proxyActivities
}
  from '@temporalio/workflow';

import type * as activities from './activities';
import type { Order } from './interfaces/order';

const { processPayment, reserveInventory, deliverOrder } = proxyActivities<typeof activities>({
  scheduleToCloseTimeout: '60 seconds',
  scheduleToStartTimeout: '60 seconds',
  startToCloseTimeout: '30 seconds',
  heartbeatTimeout: "0 seconds",
  retry: {
    initialInterval: '1 seconds',
    backoffCoefficient: 2,
    maximumInterval: '60 seconds',
   }
});

export async function OrderFulfillWorkflow(order: Order): Promise<string> {
  const inventoryResult = await reserveInventory(order);
  return `Order fulfilled ${inventoryResult}`;
}

