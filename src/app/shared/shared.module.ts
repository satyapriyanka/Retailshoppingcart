import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMaterialModule } from 'app/angular-material/angular-material.module';

import { AddProductsComponent } from './components/add-products/add-products.component';
import { DisplayOrdersComponent } from './components/display-orders/display-orders.component';
import { OrderViewComponent } from './components/order-view/order-view.component';
import { ProductsCardComponent } from './components/products-card/products-card.component';
import { ProductsCategoryComponent } from './components/products-category/products-category.component';
import { AuthGuard } from './gaurds/auth.guard';

const routes: Routes = [
  { path: 'order-view/:id', component: OrderViewComponent, canActivate: [AuthGuard] }
]

@NgModule({
  declarations: [
    AddProductsComponent,
    DisplayOrdersComponent,
    OrderViewComponent,
    ProductsCategoryComponent,
    ProductsCardComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forChild(routes),
    NgbModule.forRoot()
  ],
  exports:[
    AddProductsComponent,
    DisplayOrdersComponent,
    OrderViewComponent,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsCategoryComponent,
    ProductsCardComponent,
    CommonModule,
    NgbModule.forRoot().ngModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ]
})
export class SharedModule { }
