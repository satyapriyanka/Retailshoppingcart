import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from 'shared/services/auth/auth-service.service';
import { Subscription } from 'rxjs';
import { CheckOutService } from 'shared/services/check-out/check-out.service';
import { CheckOutItem, CheckOutCart } from 'shared/models/checkout.app';
import { MatTableDataSource, MatPaginator, Sort } from '@angular/material';
import { firestore } from 'firebase';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit, OnDestroy {

  userId: string;
  userSubscription: Subscription[] = [];
  checkoutCarts: CheckOutCart[] = [];

  constructor(private authService: AuthService,
    private checkoutService: CheckOutService) {
    this.userId = this.authService.UserId;
  }

  ngOnInit() {
    this.userSubscription.push(this.authService.UserAuthChanges.subscribe(() => {
      this.userId = this.authService.UserId;
    }))
    this.userSubscription.push(this.checkoutService
      .fetchUserCheckOuts(this.userId).subscribe((docs) => {
        this.checkoutCarts = docs;
      }));
  }

  ngOnDestroy() {
    this.userSubscription.forEach(x => x.unsubscribe());
  }

}
