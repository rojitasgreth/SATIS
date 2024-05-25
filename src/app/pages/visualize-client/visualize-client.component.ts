import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-visualize-client',
  templateUrl: './visualize-client.component.html'
})
export class VisualizeClientComponent implements OnInit{
  orden: any;
  productos: any;

  constructor(private router: Router, private cdr: ChangeDetectorRef, private dialogRef: MatDialogRef<VisualizeClientComponent>){

  }

  ngOnInit(): void {
      this.consultarOrden();
      this.consultarProductos();
  }

  consultarOrden() {
    const clienteString = localStorage.getItem('orden');
    if (clienteString !== null) {
      this.orden = JSON.parse(clienteString);
      console.log(this.orden);

    } else {
      this.router.navigate(['/home']);
    }
    this.cdr.detectChanges();
  }

  consultarProductos() {
    const productoString = localStorage.getItem('productos');
    if (productoString !== null) {
      this.productos = JSON.parse(productoString);
      console.log(this.productos);

    } else {
      this.productos = null;
    }
  }

  cerrar(): void {
    this.dialogRef.close()
  }
}
