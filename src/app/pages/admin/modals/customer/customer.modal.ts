import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environment/environment';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'product-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatIconModule],
  templateUrl: './customer.modal.html',
  encapsulation: ViewEncapsulation.None
})

export class CustomerModalComponent implements OnInit {
  customerForm: FormGroup;

  constructor(
    public matDialogRef: MatDialogRef<CustomerModalComponent>,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    const regex = /^[0-9]+$/;
    this.customerForm = this._formBuilder.group({
      RIFL: ['J', Validators.required],
      RIF: ['', Validators.required],
      cliente: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^(0424|0412|0414|0416|0426|0248|0281|0282|0283|0285|0292|0240|0247|0278|0243|0244|0246|0273|0278|0284|0285|0286|0288|0289|0241|0242|0243|0245|0249|0258|0287|0212|0259|0268|0269|0279|0235|0238|0246|0247|0251|0252|0253|0271|0274|0275|0234|0239|0287|0291|0292|0295|0255|0256|0257|0272|0293|0294|0276|0277|0278|0272|0254|0261|0262|0263|0264|0265|0266|0267)[0-9]{7}$')]],
      email: ['', [Validators.required, Validators.email]],
      estado: ['', Validators.required],
      calle: ['', [Validators.required]],
      edificio: ['']
    });
  }

  ngOnInit(): void {
  }

  cerrar(result: string): void {
    this.matDialogRef.close(result);
  };

  agregarCliente() {
    let form = this.customerForm.value;
    let rif = form.RIFL + '-' + form.RIF;
    form.RIF = rif;
    if (this.customerForm.invalid) {
      this.showInvalidMessage();
      this.customerForm.markAllAsTouched();
    } else {
      this.http.post(`${environment.BASE_URL_API}/insertarCliente`, form).subscribe(
            (response) => {
              if (response != '') {
                this.showSuccessMessage();
                this.cerrar('exitoso');
              } else {
                this.showWrongMessage();
              }
            },
            (error) => {
              console.error('Error al insertar producto:', error);
              this.showWrongMessage();
            }
      );
    }
  }

  showInvalidMessage() {
    Swal.fire({
      icon: 'warning',
      title: 'Por favor, complete todos los campos',
      showConfirmButton: true,
      confirmButtonAriaLabel: 'De acuerdo',
      confirmButtonColor: '#0097A7',

    });
  }

  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Cliente cargado exitosamente',
      showConfirmButton: true,
      confirmButtonAriaLabel: 'De acuerdo',
      confirmButtonColor: '#0097A7',

    });
  }

  showWrongMessage() {
    Swal.fire({
      icon: 'warning',
      title: 'Ha ocurrido un inconveniente',
      showConfirmButton: true,
      confirmButtonAriaLabel: 'De acuerdo',
      confirmButtonColor: '#0097A7',

    });
  }
}
