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
  selector: 'user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatIconModule],
  templateUrl: './user.modal.html',
  encapsulation: ViewEncapsulation.None
})

export class userModalComponent implements OnInit {
  usuariosForm: FormGroup;
  datosUsuario: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<userModalComponent>,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    //console.log(data, 'es estooooooooo');
    this.datosUsuario = data;
    const regex = /^[0-9]+$/;
    this.usuariosForm = this._formBuilder.group({
      cedula: [this.datosUsuario.cedula, Validators.required],
      primer_nombre: [this.datosUsuario.primer_nombre, Validators.required],
      segundo_nombre: [this.datosUsuario.segundo_nombre, Validators.required],
      primer_apellido: [this.datosUsuario.primer_apellido, Validators.required],
      fecha_nacimiento: [this.datosUsuario.fecha_nacimiento, Validators.required],
      telefono: [`0${this.datosUsuario.telefono}`, [Validators.required, Validators.pattern(regex)]],
      correo: [this.datosUsuario.correo, Validators.required],
      usuario: [this.datosUsuario.usuario, Validators.required],
      clave: [this.datosUsuario.clave, Validators.required],
      rol: [this.datosUsuario.rol, Validators.required],
      estatus: ['Activo']
    });

    //console.log(this.usuariosForm.value);

  }



  ngOnInit(): void {


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

  actualizarEmpleado() {

    if (this.usuariosForm.invalid) {
      this.showInvalidMessage();
      this.usuariosForm.markAllAsTouched();
    } else {

      let form = this.usuariosForm.value;
      form.id = this.datosUsuario.id;
      this.http.post(`${environment.BASE_URL_API}/modificarEmpleado`, form).subscribe(
        (response) => {
          if (response == 'Modificacion correcta') {
            this.showSuccessMessage();
            this.cerrar('exitoso');
          }

        }
      )
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
