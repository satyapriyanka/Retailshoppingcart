import { ShoppingCartService } from "shared/services/shopping-cart/shopping-cart.service";

export function calculateShoppingQuantity(cart: ShoppingCart) {
  if (!cart || !cart.cartItems)
    return 0;
  const totalQuantity = cart.cartItems.reduce((acc, cur) => {
    return acc + cur.quantity
  }, 0);
  return totalQuantity;
}

export function calculateProductQuantity(productId: string, cart: ShoppingCart, shoppingCartService: ShoppingCartService) {
  if (!cart || !cart.cartItems)
    return 0;

  const product = cart.cartItems.find(cart => cart.id == productId);
  if (!product)
    return 0;

  shoppingCartService.productsWithQuantity[productId] = product.quantity;
  return product.quantity;
}