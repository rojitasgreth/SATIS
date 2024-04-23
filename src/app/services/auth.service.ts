import { Injectable } from '@angular/core';
import { info } from 'autoprefixer';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   
  private _auth = new BehaviorSubject<any>(null);
  auth$ = this._auth.asObservable();

  private _infoAuth = new BehaviorSubject<any>(null);
  infoAuth$ = this._infoAuth.asObservable();

  constructor() { }

  setAuth() {
    const auth = localStorage.getItem('auth');
    console.log(auth, 'veaaa');
    
    this._auth.next(auth);
  }

  setInfoAuth(){
    const obj = localStorage.getItem('info')
    this._infoAuth.next(obj);
  }

}
