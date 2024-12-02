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
  selector: 'product-new',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatIconModule],
  templateUrl: './newProduct.modal.html',
  encapsulation: ViewEncapsulation.None
})

export class newProductModalComponent implements OnInit {
  usuariosForm: FormGroup;
  opcionesCategorias: any[] = [];
  constructor(
    public matDialogRef: MatDialogRef<newProductModalComponent>,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    const regex = /^[0-9]+$/;
    this.usuariosForm = this._formBuilder.group({
      cod_categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad_piezas: ['', Validators.required],
      precio: ['', Validators.required],
      total: ['', Validators.required],
      precio_con_envio: ['', [Validators.required, Validators.pattern(regex)]],
      total_con_envio: ['', Validators.required],
      precio_dist: ['', Validators.required],
      total_dist: ['', Validators.required],
      detalle: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.consultarCategoria();
  }

  consultarCategoria(){
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

  agregarProducto(){

    let form = this.usuariosForm.value;
    this.http.post(`${environment.BASE_URL_API}/insertarProducto`, form).subscribe(
      (response) => {
        if (response == 'Insercion correcta') {
          this.showSuccessMessage();
          this.cerrar('exitoso');
        }

      }
    )
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
}
