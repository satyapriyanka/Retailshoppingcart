import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ShoppingCartService } from 'shared/services/shopping-cart/shopping-cart.service';
import { Subscription } from 'rxjs';
import { Products } from 'shared/models/products.app';
import { calculateProductQuantity } from 'shared/helpers/products.quantity';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent implements OnInit, OnDestroy {

  shoppingCart;
  isAddingProducts: boolean = false;
  @Input('product') product: Products;
  @Input('deleteDeletedProduct') deleteDeletedProduct: boolean;
  productSubscription: Subscription[] = [];

  constructor(private shoppingCartService: ShoppingCartService) {
    this.shoppingCart = this.shoppingCartService.shoppingCart;
  }

  ngOnInit() {
    this.productSubscription.push(this.shoppingCartService.cartChanges.subscribe(() => {
      this.shoppingCart = this.shoppingCartService.shoppingCart || [];
    }));
  }


  addProductToCart(quantity) {
    const productId = this.product.id;
    this.isAddingProducts = true;
    this.shoppingCartService.addProductToCart(productId, quantity, this.deleteDeletedProduct)
      .then(() => this.isAddingProducts = false)
      .catch(() => this.isAddingProducts = false);
  }

  getProductQuantity() {
    const productId = this.product.id;
    return calculateProductQuantity(productId, this.shoppingCart, this.shoppingCartService);
  }

  ngOnDestroy() {
    this.productSubscription.forEach(x => x.unsubscribe());
  }

}
