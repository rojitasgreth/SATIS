import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  parametro: string = '';
  productos: any;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => this.parametro = params['orden']);
    this.consultarOrden();
  }

  consultarOrden() {
    let infoString = localStorage.getItem('info');

    if (infoString !== null) {
      let info = JSON.parse(infoString);
      let idUser = info.id;

      let data = {
        idUser: idUser,
        idCompra: this.parametro
      }

      this.http.post(`${environment.BASE_URL_API}/listarDetalles`, data).subscribe(
        (response: any) => {
          // console.log(response);
          this.productos = response;
          // console.log(this.productos, 'ES ESTA VERGAAA');

        },
        (error: any) => {
          console.error("Error", error);
        }
      );
    }

  }

  volver() {
    this.router.navigate(['home']);
  }
}
