import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environment/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { userModalComponent } from '../modals/users/user.modal';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { newUserModalComponent } from '../modals/users/newUser.modal';
export interface UserData {
  cedula: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  fecha_nacimiento: string;
  telefono: number;
  correo: string;
  usuario: string;
  clave: string;
  rol: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'acciones', 'cedula', 'primer_nombre', 'segundo_nombre', 'primer_apellido',
    'fecha_nacimiento', 'telefono', 'correo', 'usuario', 'clave', 'rol'
  ];
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource();
  usersCount: number = 0;
  usuariosForm: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  /**
    * Constructor
    */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient,
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
  ) {
    this.usuariosForm = this._formBuilder.group({
      cedula: [],
      primer_nombre: [],
      segundo_nombre: [],
      primer_apellido: [],
      fecha_nacimiento: [],
      telefono: [],
      correo: [],
      usuario: [],
      clave: [],
      rol: [],
      estatus: [],
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.consultarData();
  }

  nuevoUsuario() {
    const dialogRef = this._matDialog.open(newUserModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("Compose dialog was closed!");
      if (result == 'exitoso') {
        this.consultarData();
      }

    });
    this._changeDetectorRef.detectChanges();
  }

  editar(row: any): void {

    const dialogRef = this._matDialog.open(userModalComponent, {
      data: row
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("Compose dialog was closed!");
      if (result == 'exitoso') {
        this.consultarData();
      }

    });
    this._changeDetectorRef.detectChanges();
  }

  desactivar(row: any): void {

    Swal.fire({
      title: "¿Está seguro que desea desactivar el personal seleccionado?",
      text: `${row.primer_nombre} ${row.primer_apellido} es el usuario seleccionado`,
      confirmButtonText: 'Si, desactivar',
      confirmButtonColor: '#0097A7',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#D32F2F',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosForm.patchValue({
          cedula: row.cedula,
          primer_nombre: row.primer_nombre,
          segundo_nombre: row.segundo_nombre,
          primer_apellido: row.primer_apellido,
          fecha_nacimiento: row.fecha_nacimiento,
          telefono: row.telefono,
          correo: row.correo,
          usuario: row.usuario,
          clave: row.clave,
          rol: row.rol,
          estatus: ['Inactivo']
        });

        let form = this.usuariosForm.value;
        form.id = row.id;
        this.http.post(`${environment.BASE_URL_API}/modificarEmpleado`, form).subscribe(
          (response) => {
            if (response == 'Modificacion correcta') {
              this.showSuccessMessage();
              this.consultarData();
              this._changeDetectorRef.detectChanges();
            }

          }
        )
      }
    })

  }

  activar(row: any): void {

    Swal.fire({
      title: "¿Está seguro que desea activar el personal seleccionado?",
      text: `${row.primer_nombre} ${row.primer_apellido} es el usuario seleccionado`,
      confirmButtonText: 'Si, activar',
      confirmButtonColor: '#0097A7',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#D32F2F',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosForm.patchValue({
          cedula: row.cedula,
          primer_nombre: row.primer_nombre,
          segundo_nombre: row.segundo_nombre,
          primer_apellido: row.primer_apellido,
          fecha_nacimiento: row.fecha_nacimiento,
          telefono: row.telefono,
          correo: row.correo,
          usuario: row.usuario,
          clave: row.clave,
          rol: row.rol,
          estatus: ['Activo']
        });

        let form = this.usuariosForm.value;
        form.id = row.id;
        this.http.post(`${environment.BASE_URL_API}/modificarEmpleado`, form).subscribe(
          (response) => {
            if (response == 'Modificacion correcta') {
              this.showSuccessMessage();
              this.consultarData();
              this._changeDetectorRef.detectChanges();
            }

          }
        )
      }
    })

  }

  eliminar(row: any): void {

    Swal.fire({
      title: "¿Está seguro que desea eliminar el personal seleccionado?",
      text: `${row.primer_nombre} ${row.primer_apellido} es el usuario seleccionado`,
      confirmButtonText: 'Si, eliminar',
      confirmButtonColor: '#0097A7',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#D32F2F',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        let data = { id: row.id };
        this.http.post(`${environment.BASE_URL_API}/eliminarEmpleado`, data).subscribe(
          (response) => {
            if (response == 'Eliminacion exitosa') {
              this.showSuccessMessage2();
              this.consultarData();
              this._changeDetectorRef.detectChanges();
            }

          }
        )
      }
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  consultarData() {
    this.http.post(`${environment.BASE_URL_API}/listarVendedores`, {}).subscribe(
      (response: any) => {
        //console.log(response);
        this.dataSource.data = response;
        //this.dataSource.paginator = this.paginator;
        this._changeDetectorRef.detectChanges();
      },
      (error: any) => {
        console.error("Error", error);
      }
    );
  }

  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Informacion actualizada exitosamente',
      showConfirmButton: true,
      confirmButtonAriaLabel: 'De acuerdo',
      confirmButtonColor: '#0097A7',

    });
  }

  showSuccessMessage2() {
    Swal.fire({
      icon: 'success',
      title: 'Usuario eliminado exitosamente',
      showConfirmButton: true,
      confirmButtonAriaLabel: 'De acuerdo',
      confirmButtonColor: '#0097A7',

    });
  }
}
