import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuService } from 'src/app/services/menu.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  menuExpanded: boolean = true;
  idUsuario: any;
  ordenes: any;

  constructor(private service: MenuService, private authService: AuthService, private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.service.menu$.subscribe(estatus => {
      console.log(estatus);
      if (estatus == null) {
        this.menuExpanded = true;
      } else {
        this.menuExpanded = estatus;
      }
    });
    this.authService.setInfoAuth();
    this.authService.infoAuth$.subscribe(data => {
      data = JSON.parse(data);
      this.idUsuario = data.id;
      console.log(this.idUsuario, 'id');
      this.consultarOrdenes();
    });
  }

  crearOrden(){
    if (localStorage.getItem('orden')) {
      Swal.fire({
        icon: 'info',
        title: 'Ya posee una orden en proceso.',
        text: 'Por favor, finalice antes de crear una nueva orden.',
        timer: 3000
      })
    } else {
      this.router.navigate(['/purchase-order']);
      0
    }

  }


  consultarOrdenes() {

    const idUser = { "idUser": this.idUsuario };

    this.http.post(`${environment.BASE_URL_API}/listarOrdenes`, idUser).subscribe(
      (response: any) => {
        console.log(response);

        if (response !== 'NO') {
          this.ordenes = response;
        }else {
          this.ordenes = null;
        }
        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error("Error", error);
      }
    );
    console.log(this.ordenes);
  }

  verDetalles(orden: any){
    this.router.navigate(['details', orden]);
  }
}
