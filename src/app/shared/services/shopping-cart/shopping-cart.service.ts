import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, Observable, Subscription, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private cart: ShoppingCart;
  public cartChanges: Subject<void> = new Subject();
  public cartCreation: Subject<void> = new Subject();
  productsWithQuantity = {};


  get shoppingCartId() {
    if (!localStorage.getItem('shoppingCartId')) {
      localStorage.setItem('shoppingCartId', this.db.createId());
    }
    return localStorage.getItem('shoppingCartId');
  }

  get shoppingCart() {
    if (this.cart && !this.cart.cartItems)
      this.cart.cartItems = [];
    return this.cart;
  }



  constructor(private db: AngularFirestore) {
    console.log("Shopping cart service");
  }

  createShoppingCart() {
    return this.db.doc(`shoppingcart/${this.shoppingCartId}`).set({
      cartId: this.shoppingCartId,
      createdAt: Date.now()
    }, { merge: true }).then(() => {
      this.cartCreation.next();
    });
  }

  addProductToCart(productId, quantity, deleteDeletedProduct) {
    let currentCart = [];
    if (this.shoppingCart.cartItems) {
      currentCart = this.shoppingCart.cartItems;
    }

    if (quantity == 0 && deleteDeletedProduct) {
      currentCart = currentCart.filter(cart => cart['id'] !== productId);
    } else {
      let currentProduct = currentCart.find(cart => cart['id'] === productId);
      if (currentProduct) {
        currentProduct.quantity = quantity;
      } else {
        currentProduct = {
          id: productId,
          quantity: quantity
        }
        currentCart.push(currentProduct);
      }
    }


    return this.db.doc(`shoppingcart/${this.shoppingCartId}`).set({
      cartItems: currentCart
    }, { merge: true });
  }

  updateProductsInCart() {
    if (!this.shoppingCart || !this.shoppingCart.cartItems) {
      return Promise.resolve(false);
    }
    const cartItems = this.shoppingCart.cartItems.filter(item => item.quantity > 0);
    return this.db.doc(`shoppingcart/${this.shoppingCartId}`).set({
      cartItems: cartItems
    }, { merge: true });
  }

  getCartProducts(): Observable<void> {
    return this.db.doc(`shoppingcart/${this.shoppingCartId}`)
      .valueChanges()
      .pipe(map((cart => {
        let dbCart;
        if (cart) {
          dbCart = <ShoppingCart>cart;
          dbCart.cartId = this.shoppingCartId;
        } else {
          dbCart = null;
        }

        this.cart = dbCart;
        this.cartChanges.next();
      })));
  }

  resetShoppingCart() {
    return this.db.doc(`shoppingcart/${this.shoppingCartId}`).delete().then(() => {
      localStorage.removeItem('shoppingCartId');
      return true;
    }).then(() => this.createShoppingCart());
  }

}
