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
import axios from 'axios';

@Component({
  selector: 'user-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatIconModule],
  templateUrl: './newUser.modal.html',
  encapsulation: ViewEncapsulation.None
})

export class newUserModalComponent {
  usuariosForm: FormGroup;
  showPassword: boolean = false;
  constructor(
    public matDialogRef: MatDialogRef<newUserModalComponent>,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    const regex = /^[0-9]+$/;
    this.usuariosForm = this._formBuilder.group({
      cedula: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(9)]],
      primer_nombre: ['', Validators.required],
      segundo_nombre: ['', Validators.required],
      primer_apellido: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(regex)]],
      correo: ['', Validators.required],
      usuario: ['', Validators.required],
      clave: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]],
      clave2: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]],
      rol: ['', Validators.required],
      estatus: ['Activo']
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
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

  async agregarEmpleado() {

    if (this.usuariosForm.invalid) {
      this.showInvalidMessage();
      this.usuariosForm.markAllAsTouched();
      return;
    }

    // Validación de contraseñas
    if (this.usuariosForm.get('clave')?.value !== this.usuariosForm.get('clave2')?.value) {
      await Swal.fire({
        icon: 'warning',
        title: 'Las contraseñas no coinciden',
        showConfirmButton: true,
        confirmButtonAriaLabel: 'De acuerdo',
        confirmButtonColor: '#0097A7',
      });
      return;
    }

    try {
      const form = this.usuariosForm.value;
      const response = await axios.post(`${environment.BASE_URL_API}/insertarEmpleado`, form);
      console.log(response);

      // Verificación de la respuesta
      if (response.status === 200) {
        
        if (response.data == 'Insercion correcta') {
          this.showSuccessMessage();
          this.cerrar('exitoso');
        }

        if (response.data.code == 204) {
          Swal.fire({
            icon: 'warning',
            title: 'Por favor, complete todos los campos correctamente',
            showConfirmButton: true,
            confirmButtonAriaLabel: 'De acuerdo',
            confirmButtonColor: '#0097A7',
            text: `Error en el campo ${response.data.errors[0].path}: ${response.data.errors[0].msg}`
          })

        }

      }
    } catch (error) {
      // Manejo de errores
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          this.showInvalidMessage2();
        } else {
          console.error('Error del servidor:', error.response.data);
          Swal.fire({
            icon: 'error',
            title: 'Error del servidor',
            text: 'Ocurrió un error inesperado',
          });
        }
      } else {
        console.error('Error de red:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar al servidor',
        });
      }
    }
  }


  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Empleado cargado exitosamente',
      showConfirmButton: true,
      confirmButtonAriaLabel: 'De acuerdo',
      confirmButtonColor: '#0097A7',

    });
  }

  showInvalidMessage() {
    Swal.fire({
      icon: 'warning',
      title: 'Por favor, complete todos los campos correctamente',
      showConfirmButton: true,
      confirmButtonAriaLabel: 'De acuerdo',
      confirmButtonColor: '#0097A7',

    });
  }

  showInvalidMessage2() {
    Swal.fire({
      icon: 'warning',
      title: 'El usuario ya existe en el sistema',
      showConfirmButton: true,
      confirmButtonAriaLabel: 'De acuerdo',
      confirmButtonColor: '#0097A7',

    });
  }
}
