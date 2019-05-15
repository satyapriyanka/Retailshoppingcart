export class CheckOutCart {
    userId: string;
    createdAt: Date;
    checkOutItems: CheckOutItem[];
    checkoutId: string;
    totalCost: number;
    address: ShippingAddress
}

export interface ShippingAddress {
    name: string,
    address: {
        line1: string,
        line2: string
    },
    city: string
}

export interface CheckOutItem {
    category: string;
    id: string;
    imageURL: string;
    isActive: boolean;
    price: number;
    productCost: number;
    quantity: number;
    title: string;
}