import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environment/environment';
import { MatPaginator } from '@angular/material/paginator';
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
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'cedula', 'primer_nombre', 'segundo_nombre', 'primer_apellido',
    'fecha_nacimiento', 'telefono', 'correo', 'usuario', 'clave', 'rol'
  ];
   /**
     * Constructor
     */
   constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient
)
{
}

ngOnInit(): void {
  this.consultarData();
}

consultarData(){
  this.http.post(`${environment.BASE_URL_API}/listarVendedores`, {}).subscribe(
    (response: any) => {
      console.log(response);
      this.dataSource.data = response;
      this.dataSource.paginator = this.paginator;
      this._changeDetectorRef.detectChanges();
    },
    (error: any) => {
      console.error("Error", error);
    }
  );
}
}
