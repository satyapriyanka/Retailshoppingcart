import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { ProductCategory } from 'shared/enums/product-category.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'shared/services/product/product.service';
import { Products } from 'shared/models/products.app';
import { NoWhiteSpaceValidator } from 'shared/validators/nowhitespace.validator';

@Component({
  selector: 'app-admin-product-edit',
  templateUrl: './admin-product-edit.component.html',
  styleUrls: ['./admin-product-edit.component.css']
})
export class AdminProductEditComponent implements OnInit {
  productEditForm: FormGroup;
  productCategory: ProductCategory;
  productCategoryKeys = [];
  productId: string = '';

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {

   
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id')
    if (this.productId != 'new') {
      this.productService.getProductById(this.productId).subscribe((product: Products) => {
        this.productEditForm = this.createProductForm(product);
      });
    } else {
      this.productEditForm = this.createProductForm({
        id: this.productId,
        title: '',
        price: 0,
        category: '',
        imageURL: '',
        isActive: true
      })
    }

    this.productCategoryKeys = Object.values(ProductCategory);
  }

  createProductForm(product: Products) {
    return this.fb.group({
      id: [product.id],
      title: [product.title, [Validators.required,  NoWhiteSpaceValidator.minLength(3)]],
      price: [product.price, [Validators.required, Validators.min(0)]],
      category: [product.category, [Validators.required, NoWhiteSpaceValidator.minLength(3)]],
      imageURL: [product.imageURL, [Validators.required, NoWhiteSpaceValidator.minLength(10)]],
      isActive: [product.isActive || true, Validators.required]
    })
  }

  deleteProduct() {
    this.productService.deleteProduct(this.productId)
    .then(() => this.router.navigate(["/admin/products"]));
  }

  onSubmit() {
    if (!this.productEditForm.valid)
      return;

    this.productService.saveProduct(this.productEditForm.value)
      .then(() => this.router.navigate(["/admin/products"]));
  }

  get Image() {
    return this.productEditForm.get('imageURL');
  }

  get Title() {
    return this.productEditForm.get('title');
  }

  get Price() {
    return this.productEditForm.get('price');
  }

}
