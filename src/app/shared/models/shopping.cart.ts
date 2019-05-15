class ShoppingCart {
    cartId: string;
    createdAt: Date;
    cartItems: {
        id: string,
        quantity: number
    }[] = [];
}
