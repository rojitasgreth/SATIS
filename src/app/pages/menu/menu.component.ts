import { Component, HostListener } from '@angular/core';
import { OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menuExpanded: boolean = false;
  isMobile = false;
  orden: any;
  info: any;
  constructor(private service: MenuService, private _route: Router) { }
  ngOnInit(): void {
    this.checkScreenSize();
    this.service.menu$.subscribe(estatus => {
      // console.log(estatus);
      if (estatus == null) {
        this.menuExpanded = false;
      } else {
        this.menuExpanded = estatus;
      }
    });

    this.orden = localStorage.getItem('orden');
    this.info = localStorage.getItem('info');
    this.info = JSON.parse(this.info)
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768; // Considerar móvil si el ancho es <= 768px
  }

  toogleMenu() {
    this.menuExpanded = !this.menuExpanded;

    //console.log(this.menuExpanded);

  }
  cerrarSesion() {
    localStorage.clear();
    this._route.navigate(['/login'])
  }
}
