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
  templateUrl: './newProduct.modal.html',
  encapsulation: ViewEncapsulation.None
})

export class newProductModalComponent implements OnInit {
  productosForm: FormGroup;
  categoriaForm: FormGroup;
  opcionesCategorias: any[] = [];
  cargarCategoria: boolean = false;
  imagenes: File[] = [];
  fileError: boolean = false;
  constructor(
    public matDialogRef: MatDialogRef<newProductModalComponent>,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    const regex = /^[0-9]+$/;
    this.productosForm = this._formBuilder.group({
      cod_categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad_piezas: ['', Validators.required],
      precio: ['', Validators.required],
      total: ['', Validators.required],
      precio_con_envio: ['', [Validators.required]],
      total_con_envio: ['', Validators.required],
      precio_dist: ['', Validators.required],
      total_dist: ['', Validators.required],
      detalle: ['', Validators.required]
    });

    this.categoriaForm = this._formBuilder.group({
      cod_categoria: ['', Validators.required],
      categoria: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.consultarCategoria();

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

  consultarCategoria() {
    this.http.get(`${environment.BASE_URL_API}/listarCategorias`).subscribe(
      (response) => {
        if (Array.isArray(response)) {
          // Procesamos el array con map
          this.opcionesCategorias = response.map((categoria: any) => ({
            value: categoria.cod_categoria, // Aquí mapeamos 'cod_categoria'
            label: categoria.categoria      // Aquí mapeamos 'categoria'
          }));
        } else {
          console.error('La respuesta no es un array.');
        }
      },
      (error) => {
        console.error('Error al consultar las categorías:', error);
      }
    );
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // input.value = input.value.replace(/[^0-9]/g, '');
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

    // Close the dialog
    this.matDialogRef.close(result);
  };

  agregarProducto() {
    if (this.productosForm.invalid) {
      this.showInvalidMessage();
      this.productosForm.markAllAsTouched();
    } else {
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

          // Insertar el producto con todas las URLs de las imágenes
          this.http.post(`${environment.BASE_URL_API}/insertarProducto`, form).subscribe(
            (response) => {
              if (response === 'Inserción correcta') {
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
        } else {
          console.error("Error al subir todas las imágenes");
          this.showWrongMessage();
        }
      });
    }
  }

  // Subir imágenes y devolver la URL de la primera imagen
  subirImagenes(): Promise<string[]> {
    return new Promise((resolve) => {
      if (this.imagenes && this.imagenes.length > 0) {
        const requests = this.imagenes.map(file => {
          const formData = new FormData();
          formData.append('imagen', file);

          //console.log(file);

          return this.http.post(`${environment.BASE_URL_API}/CargarImagen`, formData).toPromise()
            .then((response: any) => {
              const rutaAbsoluta = response.data.path;
              const ruta = rutaAbsoluta.replace(/^.*[\\/]assets/, '../../../assets');
              return ruta.replace(/\\/g, '/');
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

  nuevaCategoria() {
    this.cargarCategoria = !this.cargarCategoria;
  }

  agregarCategoria() {
    if (this.categoriaForm.invalid) {
      this.showInvalidMessage();
      this.categoriaForm.markAllAsTouched();
    } else {
      let form = this.categoriaForm.value;
      this.http.post(`${environment.BASE_URL_API}/insertarCategoria`, form).subscribe(
        (response) => {
          //console.log(response);

          if (response == 'Insercion correcta') {
            this.cargarCategoria
            this.showSuccessMessageCat();
            this.nuevaCategoria();
            this.consultarCategoria();
          } else {
            this.showWrongMessage();
          }
        }
      )
    }
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.imagenes = []; // Reinicia la lista de imágenes

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
          this.imagenes.push(file);
        }
      }
    }

    // Validar si el número de imágenes está entre 1 y 5
    this.fileError = this.imagenes.length < 1 || this.imagenes.length > 5;
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
      title: 'Producto cargado exitosamente',
      text: 'Recuerde agregarle los colores disponibles del producto en "Agregar nuevo color"',
      showConfirmButton: true,
      confirmButtonAriaLabel: 'De acuerdo',
      confirmButtonColor: '#0097A7',

    });
  }

  showSuccessMessageCat() {
    Swal.fire({
      icon: 'success',
      title: 'Categoría cargada exitosamente',
      text: 'Ya puede visualizar esta nueva categoría',
      showConfirmButton: true,
      confirmButtonAriaLabel: 'De acuerdo',
      confirmButtonColor: '#0097A7',
      timer: 5000
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
