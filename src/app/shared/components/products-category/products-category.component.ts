import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { getKeyByValue } from 'shared/helpers/enum.extensions';
import { ProductCategory } from 'shared/enums/product-category.enum';

@Component({
  selector: 'app-products-category',
  templateUrl: './products-category.component.html',
  styleUrls: ['./products-category.component.css']
})
export class ProductsCategoryComponent implements OnInit, OnChanges {

  productCategoryKeys = [];
  @Input('category') category;
  constructor() { }

  ngOnInit() {
    this.productCategoryKeys = Object.values(ProductCategory);
  }

  fetchQueryParams(value) {
    const category = getKeyByValue(value, ProductCategory);
    return {
      category: category
    }
  }

  ngOnChanges(changes) {
    this.category = changes["category"].currentValue;
  }

}
