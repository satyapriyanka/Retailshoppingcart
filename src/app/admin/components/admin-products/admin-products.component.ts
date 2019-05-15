import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, Sort } from '@angular/material';
import { ProductService } from 'shared/services/product/product.service';
import { Products } from 'shared/models/products.app';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ["position", "title", 'price', "id"];
  dataSource = new MatTableDataSource<Products>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  products: Products[] = [];
  filterText: string = '';

  productsSub: Subscription;
  constructor(private productService: ProductService) {

  }


  ngOnInit() {
    this.productsSub = this.productService.getActiveProducts().subscribe((data) => {
      this.products = data;
      this.setProductsTableData(data);
    })
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.setProductsTableData(this.products);
      return;
    }
    const productsData = this.products;
    const sortedData = productsData.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title': return compare(a.title, b.title, isAsc);
        case 'price': return compare(a.price, b.price, isAsc);
        default: return 0;
      }
    });
    this.setProductsTableData(sortedData);
  }

  filterProducts() {
    if (!this.filterText) {
      this.setProductsTableData(this.products);
    }

    const filteredProducts = this.products.filter(product => {
      return product.title.toLocaleLowerCase().includes(this.filterText.toLocaleLowerCase()) 
            || product.price.toString().toLocaleLowerCase().includes(this.filterText.toLocaleLowerCase());
    })

    this.setProductsTableData(filteredProducts);
  }

  setProductsTableData(products: Products[]) {
    this.dataSource = new MatTableDataSource<Products>(products);
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    if (this.productsSub)
      this.productsSub.unsubscribe();
  }
}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}