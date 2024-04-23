import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  autenticado: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(): boolean {
    this.authService.setAuth();
    this.authService.auth$.subscribe(
        auth => {
            if (auth == 'true') {
                this.autenticado = true;
            } else {
              this.autenticado = false;
            }

            if (this.autenticado) {
              return true;
            }else {
              this.router.navigate(['/login']);
              return false;
            }
        }
    )
    if (this.autenticado) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
