import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../modelos/usuario';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  private URL = 'https://cloudcomputing.ups.edu.ec/api-node-siast'
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  
  // ******* ADMINISTRADOR SERVICIOS  ********
  
  obtenerUsuarios(){
    return this.http.get(`${this.URL}/user/admin/lista-usuarios/`)
  }
  obtenerUsuarios2(){
    return this.http.get<Usuario[]>(`${this.URL}/user/admin/lista-usuarios/`)
  }
  
  actualizarUsuario(usuario:Usuario){
    return this.http.post(`${this.URL}/user/admin/actualizar-usuario`,usuario);
  }

  agregarUsuario(usuario: Usuario){
    return this.http.post(`${this.URL}/user/admin/crear-usuario/`,usuario);
  }
}
