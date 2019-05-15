import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { Products } from 'shared/models/products.app';
import { Subscription, Subject, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'shared/services/product/product.service';
import { ProductCategory } from 'shared/enums/product-category.enum';
import { ShoppingCartService } from 'shared/services/shopping-cart/shopping-cart.service';
@Component({
  selector: 'app-products-card',
  templateUrl: './products-card.component.html',
  styleUrls: ['./products-card.component.css']
})
export class ProductsCardComponent implements OnInit, OnChanges, OnDestroy {

  products: Products[] = [];
  filteredProducts: Products[] = [];
  productSubscription: Subscription[] = [];
  categorySubject: Subject<string> = new Subject();

  @Input('category') category;

  constructor(private router: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartServie: ShoppingCartService) {
    // ngOnchanges gets called before ngOnInit. Hence make the call for subscription here.
    this.productSubscription.push(combineLatest(this.productService.getActiveProducts(),
      this.categorySubject.asObservable()
    ).subscribe(([products, category]) => {
        this.products = products;
        this.category = category;
        if (this.category) {
          this.filteredProducts = this.products.filter(product => product.category === ProductCategory[this.category]);
        } else {
          this.filteredProducts = this.products;
        }
        this.filteredProducts = this.filteredProducts.sort((a, b) => a.title < b.title ? -1 : 1);
      }));
  }

  ngOnInit() {
  
  }

  ngOnChanges(changes) {
    this.category = changes["category"].currentValue;
    this.categorySubject.next(this.category);
  }

  ngOnDestroy() {
    this.shoppingCartServie.updateProductsInCart();
    this.productSubscription.forEach(x => x.unsubscribe());
  }

}
