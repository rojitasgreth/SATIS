import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdmin implements CanActivate {
  autenticado: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(): boolean {
    this.authService.setInfoAuth();
    this.authService.infoAuth$.subscribe(
        auth => {
          auth = JSON.parse(auth)
            if (auth.rol == 'Admin') {
                this.autenticado = true;
            } else {
              this.autenticado = false;
            }
            if (this.autenticado) {
              return true;
            }else {
              this.router.navigate(['/home']);
              return false;
            }
        }
    )
    if (this.autenticado) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
