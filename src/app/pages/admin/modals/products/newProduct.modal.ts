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
  opcionesCategorias: any[] = [];
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
    console.log(this.productosForm.value);
    if (this.productosForm.invalid) {
      this.showInvalidMessage();
      this.productosForm.markAllAsTouched();
    } else {
      console.log(this.productosForm.value);

      let form = this.productosForm.value;
      this.http.post(`${environment.BASE_URL_API}/insertarProducto`, form).subscribe(
        (response) => {
          if (response == 'Inserción correcta') {
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
      title: 'Producto cargado exitosamente',
      text: 'Recuerde agregarle los colores disponibles del producto en "Agregar nuevo color"',
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
