import { Component, OnInit, OnDestroy } from '@angular/core';
import { calculateShoppingQuantity } from 'shared/helpers/products.quantity';
import { ShoppingCartService } from 'shared/services/shopping-cart/shopping-cart.service';
import { ProductService } from 'shared/services/product/product.service';
import { switchMap, take } from 'rxjs/operators';
import { Products } from 'shared/models/products.app';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  shoppingcart: ShoppingCart;
  productSubscription: Subscription;
  displayedColumns: string[] = ['image', 'title', 'quantity', 'price'];
  products: Products[] = [];

  constructor(private shoppingCartService: ShoppingCartService,
    private productService: ProductService,
    private router: Router) {
    this.shoppingcart = this.shoppingCartService.shoppingCart;
    this.productService.getActiveProducts()
      .pipe(take(1))
      .subscribe(products => {
        if (!this.shoppingcart || !this.shoppingcart.cartItems) return;
        const productIds = this.shoppingcart.cartItems.filter(product => product.quantity > 0)
          .map(product => product.id);
        this.products = products.filter(product => productIds.indexOf(product.id) > -1);
        this.products.sort((a, b) => a.title < b.title ? -1 : 1);
      })
  }

  ngOnInit() {
    this.productSubscription = this.shoppingCartService.cartChanges.pipe(switchMap(() => {
      this.shoppingcart = this.shoppingCartService.shoppingCart;
      return this.productService.getActiveProducts();
    }))
      .subscribe(products => {
        if (!this.shoppingcart || !this.shoppingcart.cartItems) return;
        const productIds = this.shoppingcart.cartItems.map(product => product.id);
        this.products = products.filter(product => productIds.indexOf(product.id) > -1);
        this.products.sort((a, b) => a.title < b.title ? -1 : 1);
      })
  }


  fetchCheckoutQuantity(shoppingCart) {
    return calculateShoppingQuantity(shoppingCart);
  }

  addTotalToProducts() {
    if(!this.shoppingcart || this.shoppingcart.cartItems) return 0;
    return this.products.reduce((acc, val) => {
      const productCart = this.shoppingcart.cartItems.find(acc => acc.id === val.id);
      const quantity = productCart != null ? productCart.quantity || 0 : 0;
      return acc + (val.price * quantity);
    }, 0);
  }

  clearCart() {
    if (!confirm('Are you sure you want to delete your shopping cart?')) return;
    this.shoppingCartService.resetShoppingCart().then(() => {
      this.router.navigate(["/"]);
    })
  }

  trackByFn(index, item : Products){
    return item.id;
  }

  proceedToCheckout() {
    this.router.navigate(["/check-out"], {
      queryParams:{
        id: this.shoppingcart.cartId
      }
    })
  }

  ngOnDestroy() {
    if (this.productSubscription)
      this.productSubscription.unsubscribe();
  }
}
