import { Component } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  menuExpanded: boolean = true;

  constructor(private service: MenuService){}

  toogleMenu(){
    this.menuExpanded = !this.menuExpanded;

    this.service.estatusMenu(this.menuExpanded);
  }
}
