import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-orden',
  templateUrl: './new-orden.component.html',
  styleUrls: ['./new-orden.component.scss']
})
export class NewOrdenComponent {
  ordenForm: FormGroup;

  constructor ( private _formBuilder: FormBuilder){
    this.ordenForm = this._formBuilder.group({
      Condicion: ['', Validators.required],
      tipo_envio: [''],
      RIF: ['', Validators.required],
      telefono: ['', Validators.required],
      fecha: ['', Validators.required],
      cliente: ['', Validators.required],
      email: ['', Validators.required],
      estado: ['', Validators.required],
      calle: ['', Validators.required],
      edificio: ['', Validators.required]
    });
  }


}
