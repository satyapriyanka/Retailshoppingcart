import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckOutService } from 'shared/services/check-out/check-out.service';
import { Observable, Subscription } from 'rxjs';
import { CheckOutCart, CheckOutItem } from 'shared/models/checkout.app';
import { Location } from '@angular/common';
import { MatTableDataSource, MatPaginator, Sort } from '@angular/material';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit, OnDestroy {

  checkoutCart: CheckOutCart;
  checkoutSubscription: Subscription;

  displayedColumns: string[] = ["position", "title", "imageURL", 'quantity', "price", 'productCost'];
  dataSource = new MatTableDataSource<CheckOutItem>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private route: ActivatedRoute,
    private checkoutService: CheckOutService, 
    private location: Location) { }

  ngOnInit() {
    const checkoutId = this.route.snapshot.paramMap.get('id');
    this.checkoutSubscription = this.checkoutService.getCheckout(checkoutId).subscribe(cart => {
      this.checkoutCart =cart;
      this.setCheckOutCartsTableData(this.checkoutCart.checkOutItems || []);
    });
  }

  ngOnDestroy() {
    if(this.checkoutSubscription) this.checkoutSubscription.unsubscribe();
  }


  setCheckOutCartsTableData(checkoutItems: CheckOutItem[]) {
    this.dataSource = new MatTableDataSource<CheckOutItem>(checkoutItems);
    this.dataSource.paginator = this.paginator;
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.setCheckOutCartsTableData(this.checkoutCart.checkOutItems || []);
      return;
    }
    const checkoutItems = this.checkoutCart.checkOutItems || [];
    const sortedData = checkoutItems.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title': return compare(a.title, b.title, isAsc);
        case 'iamgeURL': return compare(a.imageURL, b.imageURL, isAsc);
        case 'quantity': return compare(a.quantity, b.quantity, isAsc);
        case 'price': return compare(a.price, b.price, isAsc);
        case 'productCost': return compare(a.productCost, b.productCost, isAsc);
        default: return 0;
      }
    });
    this.setCheckOutCartsTableData(sortedData);
  }


  goBack(){
    this.location.back();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}