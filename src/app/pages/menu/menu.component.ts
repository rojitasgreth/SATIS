import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit{
  menuExpanded: boolean = true;
  constructor(private service: MenuService){}
  ngOnInit(): void {
    this.service.menu$.subscribe(estatus=>{
      console.log(estatus);
      if (estatus == null) {
        this.menuExpanded = true;
      }else {
        this.menuExpanded = estatus;
      }
    });
  }
  toogleMenu(){
    this.menuExpanded = !this.menuExpanded;
  }
}
