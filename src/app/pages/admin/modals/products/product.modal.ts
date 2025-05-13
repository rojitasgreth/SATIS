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
  selector: 'product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatIconModule],
  templateUrl: './product.modal.html',
  encapsulation: ViewEncapsulation.None
})

export class productModalComponent implements OnInit {
  productosForm: FormGroup;
  datosProductos: any;
  opcionesCategorias: any[] = [];
  imagenesParaBorrar: any[] = [];
  imagenesOriginales: any[] = [];
  imagenes: File[] = [];
  fileError: boolean = false;
  selectedFiles: File[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<productModalComponent>,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    this.datosProductos = data;
    console.log(this.datosProductos);

    this.imagenesOriginales = [...this.datosProductos.imagenes];
    this.productosForm = this._formBuilder.group({
      cod_producto: [this.datosProductos.cod_producto, Validators.required],
      descripcion: [this.datosProductos.descripcion, Validators.required],
      cantidad_piezas: [this.datosProductos.cantidad_piezas, Validators.required],
      precio: [this.datosProductos.precio, Validators.required],
      total: [this.datosProductos.total, Validators.required],
      precio_con_envio: [this.datosProductos.precio_con_envio, [Validators.required]],
      total_con_envio: [this.datosProductos.total_con_envio, Validators.required],
      precio_dist: [this.datosProductos.precio_dist, Validators.required],
      total_dist: [this.datosProductos.total_dist, Validators.required],
      detalle: [this.datosProductos.detalle, Validators.required],
      activo: [true],
      imagenes_borrar: [[]],
      imagen_principal: [0]
    });

  }

  ngOnInit(): void {

    this.productosForm.get('cantidad_piezas')?.valueChanges.subscribe(
      (precio) => {
        if (this.productosForm.get('cantidad_piezas')?.value !== '') {
          const operacion = this.productosForm.get('cantidad_piezas')?.value * this.productosForm.get('precio')?.value;
          this.productosForm.get('total')?.setValue(operacion.toFixed(2));

          const operacion2 = this.productosForm.get('cantidad_piezas')?.value * this.productosForm.get('precio_con_envio')?.value;
          this.productosForm.get('total_con_envio')?.setValue(operacion2.toFixed(2));

          const operacion3 = this.productosForm.get('cantidad_piezas')?.value * this.productosForm.get('precio_dist')?.value;
          this.productosForm.get('total_dist')?.setValue(operacion3.toFixed(2));
        }
      }
    )
    this.productosForm.get('precio')?.valueChanges.subscribe(
      (precio) => {
        if (this.productosForm.get('cantidad_piezas')?.value !== '') {
          const operacion = this.productosForm.get('cantidad_piezas')?.value * this.productosForm.get('precio')?.value;
          this.productosForm.get('total')?.setValue(operacion.toFixed(2));
        }
      }
    )

    this.productosForm.get('precio_con_envio')?.valueChanges.subscribe(
      (precio) => {
        if (this.productosForm.get('cantidad_piezas')?.value !== '') {
          const operacion = this.productosForm.get('cantidad_piezas')?.value * this.productosForm.get('precio_con_envio')?.value;
          this.productosForm.get('total_con_envio')?.setValue(operacion.toFixed(2));
        }
      }
    )

    this.productosForm.get('precio_dist')?.valueChanges.subscribe(
      (precio) => {
        if (this.productosForm.get('cantidad_piezas')?.value !== '') {
          const operacion = this.productosForm.get('cantidad_piezas')?.value * this.productosForm.get('precio_dist')?.value;
          this.productosForm.get('total_dist')?.setValue(operacion.toFixed(2));
        }
      }
    )
  }

  eliminarImagen(index: number): void {


    if (this.datosProductos.imagenes.length == 1) {
      console.log('no puede');

    } else {
      const id = this.datosProductos.imagenes[index].id;
      this.imagenesParaBorrar.push(id);
      this.productosForm.get('imagenes_borrar')?.setValue(this.imagenesParaBorrar);
      this.datosProductos.imagenes.splice(index, 1);
    }

  }

  seleccionarPrincipal(index: number): void {
    const id = this.datosProductos.imagenes[index].id;
    this.datosProductos.imagenPrincipal = index;
    this.productosForm.get('imagen_principal')?.setValue(id);
  }

  subirImagenes(): Promise<string[]> {
    return new Promise((resolve) => {

      console.log(this.imagenes);

      if (this.imagenes && this.imagenes.length > 0) {
        const requests = this.imagenes.map(file => {
          const formData = new FormData();
          formData.append('imagen', file);

          //console.log(file);

          return this.http.post(`${environment.BASE_URL_API}/CargarImagen`, formData).toPromise()
            .then((response: any) => {
              const rutaAbsoluta = response.data.path;
              const ruta = rutaAbsoluta.replace(/^.*[\\/]assets/, '');
              return ruta;
            })
            .catch(error => {
              console.error('Error al subir una imagen:', error);
              return "error";
            });
        });

        Promise.all(requests)
          .then(rutas => {
            // Filtramos los posibles errores si lo deseas
            const rutasValidas = rutas.filter(ruta => ruta !== "error");
            resolve(rutasValidas);
          })
          .catch(() => {
            resolve([]);
          });
      } else {
        console.error('No hay imágenes para subir');
        resolve([]);
      }
    });
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.imagenes = []; // Reinicia la lista de imágenes

    if (files) {
      this.selectedFiles = Array.from(files);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
          this.imagenes.push(file);
        }
      }
    } else {
      this.selectedFiles = [];
    }

    // Validar si el número de imágenes está entre 1 y 5
    this.fileError = this.imagenes.length < 1 || this.imagenes.length > 5;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  onInputChange(event: Event, fieldName: string) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Elimina caracteres no numéricos
    value = value.replace(/[^0-9]/g, '');

    // Si hay algún valor, agrega los decimales automáticamente
    if (value) {
      const numericValue = parseFloat(value) / 100; // Divide entre 100 para agregar decimales
      input.value = numericValue.toFixed(2); // Formatea con 2 decimales
      this.productosForm.get(fieldName)?.setValue(input.value); // Actualiza SOLO el campo correspondiente
    } else {
      // Si el campo está vacío, actualiza el formulario con un valor vacío
      this.productosForm.get(fieldName)?.setValue('');
    }
  }

  onText(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]/g, '');
  }

  cerrar(result: string): void {
    if (result !== 'exitoso') {
      console.log(this.imagenesOriginales);

      this.datosProductos.imagenes = [...this.imagenesOriginales];
      this.imagenesParaBorrar = [];
      this.datosProductos.imagenPrincipal = [];
      this.productosForm.get('imagenes_borrar')?.setValue([]);
    }
    this.matDialogRef.close(result);
  }

  actualizarProducto() {

    if (this.productosForm.invalid) {
      this.showInvalidMessage();
      this.productosForm.markAllAsTouched();
    } else {

      if (this.imagenes && this.imagenes.length > 0) {
        // Subir todas las imágenes
        this.subirImagenes().then((imagenesUrls) => {
          // Verificar que al menos una imagen se subió correctamente
          const urlsValidas = imagenesUrls.filter(url => url !== "error");

          if (urlsValidas.length > 0) {
            let form = this.productosForm.value;

            // Asignar la primera imagen como imagen principal
            form.img = urlsValidas[0];

            // Crear array de objetos con todas las imágenes
            form.imagenes = urlsValidas.map(url => ({ url }));

            //form.id = this.datosProductos.id;
            this.http.post(`${environment.BASE_URL_API}/modificarProducto`, form).subscribe(
              (response) => {
                //console.log(response);

                if (response == 'Modificacion correcta') {
                  this.showSuccessMessage();
                  this.cerrar('exitoso');
                }

              }
            );
          } else {
            console.error("Error al subir todas las imágenes");
          }
        });
      } else {
        let form = this.productosForm.value;

        //form.id = this.datosProductos.id;
        this.http.post(`${environment.BASE_URL_API}/modificarProducto`, form).subscribe(
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
