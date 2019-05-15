import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { Products } from 'shared/models/products.app';
import { AuthService } from '../auth/auth-service.service';
import {CheckOutCart,  CheckOutItem, ShippingAddress} from 'shared/models/checkout.app';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckOutService {

  constructor(private db: AngularFirestore,
    private authService: AuthService) { 
      console.log("In checkout service"); 
   }

  addCheckout(address: ShippingAddress, products: Products[], shoppingCart: ShoppingCart) {
    debugger;
    const checkoutProducts: CheckOutItem[] = shoppingCart.cartItems.map((item) => {
      const product = products.find(product => product.id == item.id);
      const productCost = product.price * item.quantity;
      return Object.assign({ ...product }, { ...item }, { productCost: productCost });
    });

    const userId = this.authService.UserId;
    const checkoutId = this.db.createId();
    const totalCost = checkoutProducts.reduce((acc, ini) => {
      return acc + ini.productCost;
    }, 0);

    const checkedOutDoc: CheckOutCart = Object.assign({ cartId: shoppingCart.cartId },
      {
        userId: userId,
        createdAt: new Date(),
        checkOutItems: checkoutProducts,
        checkoutId: checkoutId,
        totalCost: totalCost,
        address: address
      },
    );

    return this.db.doc(`checkout/${checkoutId}`).set(checkedOutDoc, {
        merge: true
      });
    
  }

  fetchUserCheckOuts(userId) {
    return this.fetchCheckOuts(ref => ref.where("userId", '==', userId).orderBy("createdAt", "desc"));
  }

  fetchAllCheckouts() {
    return this.fetchCheckOuts(ref => ref.orderBy("createdAt", "desc"));
  }

  private fetchCheckOuts(queryFn: QueryFn) {
    return this.db.collection('checkout', queryFn).valueChanges()
          .pipe(map(docs => {
            return docs.map((doc) => <CheckOutCart>doc)
          }))
  }


  getCheckout(checkoutId){
    return this.db.doc(`checkout/${checkoutId}`).valueChanges().pipe(map(doc => <CheckOutCart>doc));
  }
}
