import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-orden',
  templateUrl: './new-orden.component.html',
  styleUrls: ['./new-orden.component.scss']
})
export class NewOrdenComponent implements OnInit {
  ordenForm: FormGroup;
  existe: boolean = false;
  constructor(private _formBuilder: FormBuilder, private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) {
    this.ordenForm = this._formBuilder.group({
      id: [''],
      Condicion: ['', Validators.required],
      tipo_envio: [''],
      RIFL: ['J', Validators.required],
      RIF: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^(0424|0412|0414|0416|0426|0248|0281|0282|0283|0285|0292|0240|0247|0278|0243|0244|0246|0273|0278|0284|0285|0286|0288|0289|0241|0242|0243|0245|0249|0258|0287|0212|0259|0268|0269|0279|0235|0238|0246|0247|0251|0252|0253|0271|0274|0275|0234|0239|0287|0291|0292|0295|0255|0256|0257|0272|0293|0294|0276|0277|0278|0272|0254|0261|0262|0263|0264|0265|0266|0267)[0-9]{7}$')]],
      //fecha: ['', Validators.required],
      cliente: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      estado: ['', Validators.required],
      calle: ['', Validators.required],
      edificio: ['']
    });
  }
  ngOnInit(): void {
    this.ordenForm.get('Condicion')?.valueChanges.subscribe((Condicion) => {
      if (Condicion === 'Distribuidor') {
        this.ordenForm.get('tipo_envio')?.reset();
      };
    });
  }
  consultarCliente() {
    let form = this.ordenForm.value;
    let rif = form.RIFL + '-' + form.RIF;
    form.RIF = rif;
    let rifCliente = { "RIF": form.RIF }

    console.log(rif, 'clienteee');

    this.http.post(`${environment.BASE_URL_API}/listarCliente`, rifCliente).subscribe(
      (response: any) => {
        console.log(response);

        if (response === 'VACIO' || response.code === 204) {
          this.existe = false;
          this.ordenForm.get('telefono')?.reset();
          this.ordenForm.get('email')?.reset();
          this.ordenForm.get('cliente')?.reset();
          this.ordenForm.get('estado')?.reset();
          this.ordenForm.get('calle')?.reset();
          this.ordenForm.get('edificio')?.reset();

        } else {
          console.log('existe');
          this.existe = true;
          this.ordenForm.patchValue({
            id: response.id,
            telefono: response.telefono,
            cliente: response.razon_social,
            email: response.correo,
            estado: response.estado,
            calle: response.calle,
            edificio: response.edificio
          });
        }
        console.log(this.existe);

        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error("Error", error);
      }
    );
  }

  async enviarCliente() {
    if (this.ordenForm.valid) {
      console.log(this.existe);

      if (!this.existe) {
        let form = this.ordenForm.value;
        let rif = form.RIFL + '-' + form.RIF;
        form.RIF = rif;
        console.log(form);

         await this.http.post(`${environment.BASE_URL_API}/insertarCliente`, form).subscribe(
           (response: any) => {
             console.log(response, 'respuesta insercion');

               this.ordenForm.patchValue({
                 id: response
               })
             this.cdr.detectChanges();
             localStorage.setItem('orden', JSON.stringify(form));
           },
           (error: any) => {
             console.error("Error", error);
           }
         );
       }
       this.router.navigate(['/catalog']);
      } else {
        Swal.fire({
          title: 'Por favor, complete todos los campos',
          icon: 'error',
          showConfirmButton: false,
          timer: 6000
        });
      }
  }

  continuar() {
    let form = this.ordenForm.value;
    let rif = form.RIFL + '-' + form.RIF;
    form.RIF = rif;
    localStorage.setItem('orden', JSON.stringify(form));
    this.router.navigate(['/catalog']);
  }


}
