import { Injectable } from '@angular/core';
import { Products } from 'shared/models/products.app';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from 'shared/enums/product-category.enum';
import { getKeyByValue } from 'shared/helpers/enum.extensions';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFirestore) { 
    console.log("In product service");
  }

  saveProduct(product: Products) {
    const id = product.id;
    if (id == "new") {
      product.id = this.db.createId();
    }

    product.category = getKeyByValue((product.category) as ProductCategory, ProductCategory);
    return this.db.doc(`products/${product.id}`).set(product, { merge: true });
  }

  getProductById(id: string): Observable<Products> {
    return this.db.doc(`products/${id}`).valueChanges()
      .pipe(map((doc) => <Products>doc));
  }

  getActiveProducts() {
    return this.db.collection('products', ref => ref.where("isActive", "==", true))
      .valueChanges()
      .pipe(map((dbProduct) => {
        return dbProduct.map((product: Products) => {
          product.category = ProductCategory[product.category];
          return product;
        })
      }))
  }

  deleteProduct(id) {
    return this.db.doc(`products/${id}`).set({ isActive: false }, { merge: true });
  }

}
