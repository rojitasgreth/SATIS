import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuService } from 'src/app/services/menu.service';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private service: MenuService, private authService: AuthService, private http: HttpClient, private cdr: ChangeDetectorRef) { }

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

  consultarOrdenes() {

    const idUser = { "idUser": this.idUsuario };

    this.http.post(`http://localhost:5000/satis/listarOrdenes`, idUser).subscribe(
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
}
