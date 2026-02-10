// Type definitions for the Order Management app

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    createdAt: string;
    orderNumber: string;
}

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    PlaceOrder: { reorderItems?: OrderItem[] };
    OrderHistory: undefined;
    OrderDetails: { order: Order };
};
