import { Order } from './interfaces/order';

export async function requireApproval(order: Order): Promise<boolean> {
  console.log(`Checking order requires approval (over $10k)`);

  if (order.items.reduce((sum, item) =>
    sum + item.itemPrice * item.quantity, 0) > 10000) {
    console.log('Order requires approval');
    return true;
  }

  return false;
}

export async function processPayment(order: Order): Promise<string> {
  console.log("Processing payment...");

  if (order.payment.creditCard.expiration === "12/23") {
    throw new CreditCardExpiredException("Credit card expired");
  }

  // Simulate payment processing logic
  return `Payment processed for ${order.items.length} items.`;
}

export async function reserveInventory(order: Order): Promise<string> {
  console.log("Reserving inventory...");
  // Simulate inventory reservation logic
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