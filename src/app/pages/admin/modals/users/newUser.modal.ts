import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environment/environment';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
@Component({
  selector: 'user-new',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatIconModule],
  templateUrl: './newUser.modal.html',
  encapsulation: ViewEncapsulation.None
})

export class newUserModalComponent {
  usuariosForm: FormGroup;
  constructor(
    public matDialogRef: MatDialogRef<newUserModalComponent>,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    const regex = /^[0-9]+$/;
    this.usuariosForm = this._formBuilder.group({
      cedula: ['', Validators.required],
      primer_nombre: ['', Validators.required],
      segundo_nombre: ['', Validators.required],
      primer_apellido: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(regex)]],
      correo: ['', Validators.required],
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
      rol: ['', Validators.required],
      estatus: ['Activo']
    });
  }



  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  onText(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]/g, '');
  }

  cerrar(result: string): void {

    // Close the dialog
    this.matDialogRef.close(result);
  };

  agregarEmpleado(){

    if (this.usuariosForm.invalid) {
      this.showInvalidMessage();
      this.usuariosForm.markAllAsTouched();
    } else {
      let form = this.usuariosForm.value;
      this.http.post(`${environment.BASE_URL_API}/insertarEmpleado`, form).subscribe(
        (response) => {
          if (response == 'Insercion correcta') {
            this.showSuccessMessage();
            this.cerrar('exitoso');
          }

        }
      )
    }
  }


  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Empleado cargado exitosamente',
      showConfirmButton: false,
      timer: 3000
    });
  }

  showInvalidMessage() {
    Swal.fire({
      icon: 'warning',
      title: 'Por favor, complete todos los campos',
      showConfirmButton: false,
      timer: 3000
    });
  }
}
