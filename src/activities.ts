import * as activity from '@temporalio/activity';
import { Order } from './interfaces/order';

export async function requireApproval(order: Order): Promise<boolean> {
  console.log(`Checking order requires approval (over $10k)`);

  // Simulate approval logic
  if (order.items.reduce((sum, item) =>
    sum + item.itemPrice * item.quantity, 0) > 10000) {
    console.log('Order requires approval');
    return true;
  }

  return false;
}

export async function processPayment(order: Order): Promise<string> {
  console.log("Processing payment...");

  // Simulate payment processing logic
  if (order.payment.creditCard.expiration === "12/23") {
    throw new CreditCardExpiredException("Credit card expired");
  }

  return `Payment processed for ${order.items.length} items.`;
}

export async function reserveInventory(order: Order): Promise<string> {
  console.log("Reserving inventory...");
  
  // Simulate inventory service downtime
  // The activity will sleep the first 3 times it is called
  // And throw an error to simulate API call timeout
  // const { attempt } = activity.Context.current().info;
  // if (attempt <= 3) {
  //   console.log(`Inventory service down, attempt ${attempt}`);
  //   await new Promise((resolve) => setTimeout(resolve, 10000));
  //   throw new Error("Inventory service down");
  // }

  return `Inventory reserved for ${order.items.length} items.`;
}

export async function deliverOrder(order: Order): Promise<string> {
  console.log("Delivering order...");
  // Simulate order delivery logic
  return `Order delivered for ${order.items.length} items.`;
}


export class CreditCardExpiredException extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = CreditCardExpiredException.name;
  }
}