import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './auth/authGuard.component';
import { NewOrdenComponent } from './pages/new-orden/new-orden.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ProductComponent } from './pages/product/product.component';
import { VisualizeOrdenComponent } from './pages/visualize-orden/visualize-orden.component';
import { EditProdcutComponent } from './pages/edit-prodcut/edit-prodcut.component';
import { DetailsComponent } from './pages/details/details.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { AuthGuardAdmin } from './auth/authGuardAdmin.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'purchase-order', component: NewOrdenComponent, canActivate: [AuthGuard]},
  { path: 'catalog', component: CatalogComponent, canActivate: [AuthGuard]},
  { path: 'product/:cod', component: ProductComponent, canActivate: [AuthGuard]},
  { path: 'visualize-orden', component: VisualizeOrdenComponent, canActivate: [AuthGuard]},
  { path: 'editProduct', component: EditProdcutComponent, canActivate: [AuthGuard]},
  { path: 'details/:orden', component: DetailsComponent, canActivate: [AuthGuard]},
  { path: 'admin/users', component: UsersComponent, canActivate: [AuthGuardAdmin]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
