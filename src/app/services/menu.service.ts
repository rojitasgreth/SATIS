import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
   
  private _menu = new BehaviorSubject<any>(null);
  menu$ = this._menu.asObservable();

  constructor() { }

  estatusMenu(estatus: boolean) {
    this._menu.next(estatus);
  }

}
