import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OtherService {
   
  private _orden = new BehaviorSubject<any>(null);
  orden$ = this._orden.asObservable();

  constructor() { }

  setOrden() {
    const orden = localStorage.getItem('orden');   
    this._orden.next(orden);
  }
}
