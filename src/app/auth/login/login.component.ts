import { NgStyle } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, FormsModule, Validators, ReactiveFormsModule, AbstractControl, FormControl} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'satis-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, NgStyle],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup ({
    user: new FormControl('',
    [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private http: HttpClient
  ){}

  get user(){
    return this.loginForm.get('user');
  }

  get password(){
    return this.loginForm.get('password');
  }

  logIn(){
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log(formData, 'hola');

      this.http.post(`http://localhost:5000/satis/login`, formData).subscribe(
        (response) => {
          console.log(response);
          
          if (response == 'No existe el usuario.') {
            Swal.fire({
              title: 'Usuario no existe.',
              icon: 'error',
              showConfirmButton: false,
              timer: 3000
            })
          }

          if (response == 'Credenciales incorrectas.') {
            Swal.fire({
              title: 'Credenciales incorrectas.',
              icon: 'error',
              showConfirmButton: false,
              timer: 3000
            })
          }
          if (response == 'Usuario inactivo.') {
            Swal.fire({
              title: 'Usuario inactivo.',
              icon: 'error',
              showConfirmButton: false,
              timer: 3000
            })
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