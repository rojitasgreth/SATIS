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
  editarColores: FormGroup;
  productoData: any;
  nuevoColor: boolean = false;
  listaColores: any = [];
  generoSeleccionado = 'Hembra';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<colorProductModalComponent>,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    const regex = /^[0-9]+$/;
    this.productoData = data;

    this.coloresForm = this._formBuilder.group({
      colores: this._formBuilder.array([])
    });

    this.editarColores = this._formBuilder.group({
        editar: this._formBuilder.array([])
    });
    this.listarColores('H');

    this.createColor();
  }

  listarColores(genero: string){

    if (genero == 'V') {
      this.generoSeleccionado = 'Varón';
    } else {
      this.generoSeleccionado = 'Hembra';
    }
    const data = {
      "cod_producto": this.productoData.cod_producto,
      "genero": genero
    };

    this.http.post(`${environment.BASE_URL_API}/listarColores`, data).subscribe(
      (response: any) => {
        if (response !== 'VACIO') {
          this.listaColores = response;

          const coloresArray = this.listaColores.map((item: any) => {
            return this._formBuilder.group({
              codigo_color: [item.codigo_color, Validators.required],
              descripcion_color: [item.descripcion_color, Validators.required],
              cod_producto: [this.productoData.cod_producto, Validators.required],
              genero: [genero, Validators.required]
            });
          });

          this.editarColores.setControl('editar', this._formBuilder.array(coloresArray));
          this.cdr.detectChanges();
        } else {
          this.listaColores = [];
          this.editarColores.setControl('editar', this._formBuilder.array([]));
        }
      },
      (error: any) => {
        console.error("Error", error);
      }
    );
  }

  guardarColor(index: any){
    // Obtener el grupo de formulario específico
  const colorFormGroup = this.editar.controls[index] as FormGroup;

  // Verificar si el formulario es válido
  if (colorFormGroup.invalid) {
    // Marcar todos los campos como tocados para mostrar errores
    colorFormGroup.markAllAsTouched();
    return;
  }

  // Preparar los datos para enviar al backend
  const datosParaEnviar = {
    codigo_color: colorFormGroup.value.codigo_color,
    descripcion_color: colorFormGroup.value.descripcion_color, // Este es el campo editado
    cod_producto: colorFormGroup.value.cod_producto,
    genero: colorFormGroup.value.genero
  };

  this.http.post(`${environment.BASE_URL_API}/modificarColores`, datosParaEnviar).subscribe({
    next: (response) => {
      // Mostrar mensaje de éxito
      this.showSuccessMessage('Color actualizado correctamente');

      // Opcional: Actualizar la lista de colores
      this.listarColores(datosParaEnviar.genero);
    },
    error: (err) => {
      console.error('Error al guardar:', err);
      this.showWrongMessage;
    }
  });

  }

  eliminarColor(index: number){
    Swal.fire({
      title: "¿Está seguro que desea eliminar el color seleccionado?",
      text: `Una vez eliminado no podrá recuperarse`,
      confirmButtonText: 'Si, eliminar',
      confirmButtonColor: '#0097A7',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#D32F2F',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {

        const colorFormGroup = this.editar.controls[index] as FormGroup;

        // Verificar si el formulario es válido
        if (colorFormGroup.invalid) {
          // Marcar todos los campos como tocados para mostrar errores
          colorFormGroup.markAllAsTouched();
          return;
        }

        // Preparar los datos para enviar al backend
        const datosParaEnviar = {
          codigo_color: colorFormGroup.value.codigo_color,
          descripcion_color: colorFormGroup.value.descripcion_color, // Este es el campo editado
          cod_producto: colorFormGroup.value.cod_producto,
          genero: colorFormGroup.value.genero
        };

        this.http.post(`${environment.BASE_URL_API}/eliminarColor`, datosParaEnviar).subscribe({
          next: (response) => {
            this.showSuccessMessage('Color eliminado correctamente');
            this.listarColores(datosParaEnviar.genero);
          },
          error: (err) => {
            console.error('Error al guardar:', err);
            this.showWrongMessage;
          }
        });

      }
    })

  }

  agregarForm(){
    this.nuevoColor = !this.nuevoColor;
    this.cdr.detectChanges();
  }

  get editar(): FormArray {
    return this.editarColores.get('editar') as FormArray;
  }

  get colores() {
    return this.coloresForm.get('colores') as FormArray;
  }

  createColor() {
    //console.log('holaaaa');

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
      //console.log(form);

      this.http.post(`${environment.BASE_URL_API}/insertarColores`, form).subscribe(
        (response) => {
          if (response == 'Insercion correcta') {
            this.showSuccessMessage('Color guardado exitosamente');
            this.cerrar('exitoso');
          } else {
            this.showWrongMessage();
          }


        },
        (error) => {
          Swal.fire({
            icon: 'warning',
            title: 'El codigo del color ya existe',
            showConfirmButton: true,
            confirmButtonAriaLabel: 'De acuerdo',
            confirmButtonColor: '#0097A7',

          });
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

  showSuccessMessage(mensaje: string) {
    Swal.fire({
      icon: 'success',
      title: mensaje,
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
