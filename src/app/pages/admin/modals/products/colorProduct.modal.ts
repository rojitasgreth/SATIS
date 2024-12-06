import { Component, ViewEncapsulation, ChangeDetectorRef, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environment/environment";
import Swal from "sweetalert2";
@Component({
  selector: 'product-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatIconModule],
  templateUrl: './colorProduct.modal.html',
  encapsulation: ViewEncapsulation.None
})

export class colorProductModalComponent {
  coloresForm: FormGroup;
  productoData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<colorProductModalComponent>,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    const regex = /^[0-9]+$/;
    this.productoData = data;
    console.log(this.productoData);

    this.coloresForm = this._formBuilder.group({
      colores: this._formBuilder.array([])
    });

    this.createColor();
  }

  get colores() {
    return this.coloresForm.get('colores') as FormArray;
  }

  createColor() {
    console.log('holaaaa');

    const colorFormGroup = this._formBuilder.group({
      codigo_color: ['', Validators.required],
      descripcion_color: ['', Validators.required],
      cod_producto: [this.productoData.cod_producto, Validators.required],
      genero: ['', Validators.required]
    });
    this.colores.push(colorFormGroup);
  };

  cerrar(result: string): void {

    // Close the dialog
    this.matDialogRef.close(result);
  };

  agregarColor() {
    if (this.coloresForm.invalid) {
      this.showInvalidMessage();
      this.coloresForm.markAllAsTouched();
    } else {
      let form = this.coloresForm.value;
      console.log(form);

      this.http.post(`${environment.BASE_URL_API}/insertarColores`, form).subscribe(
        (response) => {
          if (response == 'Insercion correcta') {
            this.showSuccessMessage();
            this.cerrar('exitoso');
          } else {
            this.showWrongMessage();
          }
        }
      )
    }
  }

  showInvalidMessage() {
    Swal.fire({
      icon: 'warning',
      title: 'Por favor, complete todos los campos',
      showConfirmButton: false,
      timer: 3000
    });
  }

  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Color cargado exitosamente',
      showConfirmButton: false,
      timer: 3000
    });
  }

  showWrongMessage() {
    Swal.fire({
      icon: 'warning',
      title: 'Ha ocurrido un inconveniente',
      showConfirmButton: false,
      timer: 3000
    });
  }
}
