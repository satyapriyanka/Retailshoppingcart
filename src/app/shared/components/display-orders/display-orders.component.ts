import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatPaginator, Sort } from '@angular/material';
import { CheckOutCart } from 'shared/models/checkout.app';

@Component({
  selector: 'app-display-orders',
  templateUrl: './display-orders.component.html',
  styleUrls: ['./display-orders.component.css']
})
export class DisplayOrdersComponent implements OnInit, OnChanges {

  @Input('checkoutCarts') checkoutCarts: CheckOutCart[] = [];
  displayedColumns: string[] = ["position", "address.name", "createdAt", 'checkoutId'];
  dataSource = new MatTableDataSource<CheckOutCart>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
   this.checkoutCarts = changes['checkoutCarts'].currentValue;
   this.setCheckOutCartsTableData(this.checkoutCarts);
  }

  setCheckOutCartsTableData(checkoutCarts: CheckOutCart[]) {
    this.dataSource = new MatTableDataSource<CheckOutCart>(checkoutCarts);
    this.dataSource.paginator = this.paginator;
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.setCheckOutCartsTableData(this.checkoutCarts);
      return;
    }
    const carts = this.checkoutCarts;
    const sortedData = carts.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'address.name': return compare(a.address.name, b.address.name, isAsc);
        case 'createdAt': return compare((a.createdAt as any).toDate().toDateString(), (b.createdAt as any).toDate().toDateString(), isAsc);
        default: return 0;
      }
    });
    this.setCheckOutCartsTableData(sortedData);
  }

}



function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
