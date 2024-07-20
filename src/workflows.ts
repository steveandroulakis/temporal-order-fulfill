import { proxyActivities } from '@temporalio/workflow';

import type * as activities from './activities';
import type { Order } from './interfaces/order';

const { validateOrder, processPayment, reserveInventory, deliverOrder } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export async function OrderFulfillWorkflow(order: Order): Promise<string> {
  if (await validateOrder(order)) {
    const paymentResult = await processPayment(order);
    const inventoryResult = await reserveInventory(order);
    const deliveryResult = await deliverOrder(order);
    return `Order fulfilled: ${paymentResult}, ${inventoryResult}, ${deliveryResult}`;
  } else {
    throw new Error('Order validation failed');
  }
}
