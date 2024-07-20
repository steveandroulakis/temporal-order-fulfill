import { Client } from '@temporalio/client';
import { OrderFulfillWorkflow } from './workflows';
import type { Order } from './interfaces/order';

export async function runWorkflow(client: Client, taskQueue: string): Promise<void> {
  const sampleOrder: Order = {
    items: [
      { itemName: "Headphones Pro", itemPrice: 399.00, quantity: 1 },
      { itemName: "Wireless Charger", itemPrice: 29.99, quantity: 2 }
    ],
    payment: {
      creditCard: {
        number: "1234 5678 1234 5678",
        expiration: "12/25",
      }
    },
  };

  // Run example workflow and await its completion
  const result = await client.workflow.execute(OrderFulfillWorkflow, {
    taskQueue,
    workflowId: `order-fulfill-${Date.now()}`,
    args: [sampleOrder],
  });
  console.log(result); // Processed Order Details!
}
