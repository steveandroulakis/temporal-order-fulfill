export interface OrderItem {
    itemName: string;
    itemPrice: number;
    quantity: number;
}

export interface Order {
    items: OrderItem[];
}