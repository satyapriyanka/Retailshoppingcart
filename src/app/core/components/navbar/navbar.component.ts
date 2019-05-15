import { Component, OnInit } from '@angular/core';
import { AuthService } from 'shared/services/auth/auth-service.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ShoppingCartService } from 'shared/services/shopping-cart/shopping-cart.service';
import { calculateShoppingQuantity } from 'shared/helpers/products.quantity';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  authSubs: Subscription[] = [];
  redirectUrl = "/";
  shoppingCart: ShoppingCart;

  constructor(
    public authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private shoppingCartService: ShoppingCartService
  ) {
    this.authService.isWaitingForResponse = true;
  }

  ngOnInit() {
    this.afAuth.authState.subscribe((res) => {
      if (res) {
        this.authService.saveLogin(res).then(() => {
          this.authService.isWaitingForResponse = false;
          if (this.authService.UserId) {
            this.authSubs.forEach(t => t.unsubscribe());
            this.fetchUser(this.redirectUrl);
          }
        })
      }
      else {
        this.authService.isWaitingForResponse = false;
      }
    });

    //Create a shopping cart if not exists and fetch the cart
    this.shoppingCartService.createShoppingCart();

    this.shoppingCartService.cartCreation.pipe((switchMap(() => this.shoppingCartService.getCartProducts())))
      .subscribe(() => {
        this.shoppingCart = this.shoppingCartService.shoppingCart;
      });
     
  }

  logOut() {
    this.authService.logOut();
  }

  fetchUser(redirectUrl) {
    this.authSubs.push(this.authService.fetchUser().subscribe(() => {
      if (localStorage.getItem('redirectUrl')) {
        this.router.navigateByUrl(localStorage.getItem('redirectUrl'));
        localStorage.removeItem('redirectUrl');
      }
    }));
  }

  calculateShoppingItems(cart: ShoppingCart) {
   return calculateShoppingQuantity(cart);
  }
}
