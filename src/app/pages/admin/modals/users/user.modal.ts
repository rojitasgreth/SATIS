import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environment/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-edit',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule],
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
    console.log(data, 'es estooooooooo');
    this.datosUsuario = data;

    this.usuariosForm = this._formBuilder.group({
      cedula: [this.datosUsuario.cedula, Validators.required],
      primer_nombre: [this.datosUsuario.primer_nombre, Validators.required],
      segundo_nombre: [this.datosUsuario.segundo_nombre, Validators.required],
      primer_apellido: [this.datosUsuario.primer_apellido, Validators.required],
      fecha_nacimiento: [this.datosUsuario.fecha_nacimiento, Validators.required],
      telefono: [this.datosUsuario.telefono, Validators.required],
      correo: [this.datosUsuario.correo, Validators.required],
      usuario: [this.datosUsuario.usuario, Validators.required],
      clave: [this.datosUsuario.clave, Validators.required],
      rol: [this.datosUsuario.rol, Validators.required],
      estatus: ['Activo']
    });

    console.log(this.usuariosForm.value);

  }



  ngOnInit(): void {


  }



  cerrar(result: string): void {

    // Close the dialog
    this.matDialogRef.close(result);
  };

  actualizarEmpleado(){

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


  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Informacion actualizada exitosamente',
      showConfirmButton: false,
      timer: 3000
    });
  }
}
