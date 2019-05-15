import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from 'shared/services/shopping-cart/shopping-cart.service';
import { switchMap, take } from 'rxjs/operators';
import { ProductService } from 'shared/services/product/product.service';
import { Subscription } from 'rxjs';
import { Products } from 'shared/models/products.app';
import { calculateShoppingQuantity } from 'shared/helpers/products.quantity';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoWhiteSpaceValidator } from 'shared/validators/nowhitespace.validator';
import { CheckOutService } from 'shared/services/check-out/check-out.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit, OnDestroy {

  shoppingCart: ShoppingCart;
  productSubscription: Subscription;
  products: Products[] = [];
  checkoutForm: FormGroup;

  constructor(private shoppingCartService: ShoppingCartService,
    private productService: ProductService,
    private checkOutService: CheckOutService,
    private fb: FormBuilder,
    private router: Router) {
    this.shoppingCart = this.shoppingCartService.shoppingCart;
    this.productService.getActiveProducts().pipe(take(1)).subscribe(products => this.setProducts(products));

    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, NoWhiteSpaceValidator.minLength(4)]],
      address: this.fb.group({
        line1: ['', [Validators.required, NoWhiteSpaceValidator.minLength(7)]],
        line2: ['', [Validators.required, NoWhiteSpaceValidator.minLength(7)]]
      }),
      city: ['', [Validators.required, NoWhiteSpaceValidator.minLength(3)]]
    })
  }

  ngOnInit() {
    this.productSubscription = this.shoppingCartService.cartChanges.pipe(switchMap(() => {
      this.shoppingCart = this.shoppingCartService.shoppingCart;
      return this.productService.getActiveProducts();
    }))
      .subscribe(products => this.setProducts(products))
  }

  private setProducts(products) {
    if (!this.shoppingCart || !this.shoppingCart.cartItems) return;
    const productIds = this.shoppingCart.cartItems.filter(product => product.quantity > 0).map(product => product.id);
    this.products = products.filter(product => productIds.indexOf(product.id) > -1);
    this.products.sort((a, b) => a.title < b.title ? -1 : 1);
  }

  fetchCheckoutQuantity(cart) {
    return calculateShoppingQuantity(cart);
  }

  getQuantity(productId) {
    const product = this.shoppingCart.cartItems.find(item => item.id == productId);
    return product ? product.quantity : 0;
  }


  addTotalToProducts() {
    return this.products.reduce((acc, val) => {
      const productCart = this.shoppingCart.cartItems.find(acc => acc.id === val.id);
      const quantity = productCart != null ? productCart.quantity || 0 : 0;
      return acc + (val.price * quantity);
    }, 0);
  }

  onSubmit() {
    if (this.checkoutForm.invalid) return;
    this.checkOutService.addCheckout(this.checkoutForm.value, this.products, this.shoppingCart)
      .then(() => this.shoppingCartService.resetShoppingCart())
      .then(() => {
        this.router.navigate(["/order-success"]);
      })
    console.log(this.checkoutForm.value);
  }

  ngOnDestroy() {
    if (this.productSubscription)
      this.productSubscription.unsubscribe();
  }


}