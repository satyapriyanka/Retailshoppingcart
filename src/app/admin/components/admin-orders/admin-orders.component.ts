import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CheckOutCart } from 'shared/models/checkout.app';
import { CheckOutService } from 'shared/services/check-out/check-out.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  checkoutCarts: CheckOutCart[] = [];
  constructor(
    private checkoutService: CheckOutService
  ) { }

  ngOnInit() {
    this.userSubscription = this.checkoutService.fetchAllCheckouts().subscribe(docs => this.checkoutCarts = docs);
  }

  ngOnDestroy() {
    if(this.userSubscription) this.userSubscription.unsubscribe();
  }
}
