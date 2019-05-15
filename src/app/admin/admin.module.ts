import { NgModule } from '@angular/core';
import { SharedModule } from 'shared/shared.module';

import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminProductEditComponent } from './components/admin-product-edit/admin-product-edit.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/shared/gaurds/auth.guard';
import { AdminAuthGuard } from './gaurds/admin-auth.guard';


const routes: Routes = [
  { path: 'admin/products/:id', component: AdminProductEditComponent, canActivate: [AuthGuard, AdminAuthGuard] },
  { path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard, AdminAuthGuard] },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard, AdminAuthGuard] }
]


@NgModule({
  declarations: [
    AdminProductsComponent,
    AdminProductEditComponent,
    AdminOrdersComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    AdminProductsComponent,
    AdminProductEditComponent,
    AdminOrdersComponent
  ]
})
export class AdminModule { }
