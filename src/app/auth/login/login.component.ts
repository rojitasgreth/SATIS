import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'satis-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  
  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private route: Router,
    private authService: AuthService
  ){
    this.loginForm = this._formBuilder.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('hola', this.loginForm.get('usuario'));
    
  }

  logIn(){
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log(formData.usuario, 'hola');

      this.http.post(`http://localhost:5000/satis/login`, formData).subscribe(
        (response: any) => {
          console.log(response.rol);

          if (response == 'No existe el usuario.') {
            Swal.fire({
              title: 'Usuario no existe.',
              icon: 'error',
              showConfirmButton: false,
              timer: 3000
            })
          } else if (response == 'Credenciales incorrectas.') {
            Swal.fire({
              title: 'Credenciales incorrectas.',
              icon: 'error',
              showConfirmButton: false,
              timer: 3000
            })
          } else if (response == 'Usuario inactivo.') {
            Swal.fire({
              title: 'Usuario inactivo.',
              icon: 'error',
              showConfirmButton: false,
              timer: 3000
            })
          } else if (response.rol == 'Vendedor') {
            console.log('aquii');
            
            const auth = 'true';
            localStorage.setItem('auth', auth);
            this.authService.setAuth();
            localStorage.setItem('info', JSON.stringify(response))
            this.authService.setInfoAuth();
            this.route.navigate(['/home']);
          }else {
            console.log('admin');
            localStorage.setItem('info', JSON.stringify(response))
            this.authService.setInfoAuth();
          }
        },
        (error) => {
          console.error("Error", error);
        }

      )
    }else {
      console.log('No valido');
      
    }
    
  }
}
