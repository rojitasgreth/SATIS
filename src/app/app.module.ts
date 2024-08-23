import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { HeaderComponent } from './pages/header/header.component';
import { MatCardModule } from '@angular/material/card';
import { NewOrdenComponent } from './pages/new-orden/new-orden.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ProductComponent } from './pages/product/product.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog'; // Importa MatDialogModule
import { VisualizeOrdenComponent } from './pages/visualize-orden/visualize-orden.component';
import { VisualizeClientComponent } from './pages/visualize-client/visualize-client.component';
import { EditProdcutComponent } from './pages/edit-prodcut/edit-prodcut.component';
import { DetailsComponent } from './pages/details/details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    HeaderComponent,
    NewOrdenComponent,
    CatalogComponent,
    ProductComponent,
    VisualizeOrdenComponent,
    VisualizeClientComponent,
    EditProdcutComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatTooltipModule,
    FormsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
