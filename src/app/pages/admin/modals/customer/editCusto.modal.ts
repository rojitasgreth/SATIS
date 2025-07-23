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
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'customer-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatIconModule, MatTooltipModule],
  templateUrl: './editCusto.modal.html',
  encapsulation: ViewEncapsulation.None
})

export class editCustomerModal implements OnInit {
  clientesForm: FormGroup;
  datosClientes: any;
  opcionesCategorias: any[] = [];
  imagenesParaBorrar: any[] = [];
  imagenesOriginales: any[] = [];
  imagenes: File[] = [];
  fileError: boolean = false;
  selectedFiles: File[] = [];
  baseUrl = environment.BASE_URL_API;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<editCustomerModal>,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    this.datosClientes = data;

    this.clientesForm = this._formBuilder.group({
      id:[this.datosClientes.id, Validators.required],
      RIF: [this.datosClientes.rif, Validators.required],
      cliente: [this.datosClientes.razon_social, Validators.required],
      email: [this.datosClientes.correo, Validators.required],
      telefono: [this.datosClientes.telefono, Validators.required],
      estado: [this.datosClientes.estado, Validators.required],
      calle: [this.datosClientes.calle, [Validators.required]],
      edificio: [this.datosClientes.edificio],
      estatus: [true]
    });

  }

  ngOnInit(): void {
  }

  cerrar(result: string): void {
    this.matDialogRef.close(result);
  }

  actualizarCliente() {
    console.log(this.clientesForm);

    if (this.clientesForm.invalid) {
      this.showInvalidMessage();
      this.clientesForm.markAllAsTouched();
    } else {

      this.http.post(`${environment.BASE_URL_API}/modificarCliente`, this.clientesForm.value).subscribe(
        (response) => {
          //console.log(response);

          if (response == 'Modificacion correcta') {
            this.showSuccessMessage();
            this.cerrar('exitoso');
          }

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
      title: 'Informacion actualizada exitosamente',
      showConfirmButton: true,
      confirmButtonAriaLabel: 'De acuerdo',
      confirmButtonColor: '#0097A7',

    });
  }
}
