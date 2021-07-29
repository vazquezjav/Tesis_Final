import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { Respuesta } from '../modelos/respuesta';
import { User } from '../modelos/user';
import { Usuario } from '../modelos/usuario';
import { AdminServiceService } from './admin-service.service';
import decode from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private URL = 'https://cloudcomputing.ups.edu.ec/api-node-siast'

  //private URL_REGISTER = '172.16.26.27:3000/user/singup'
  cont :number = 0;
  constructor(private http: HttpClient, 
    private jwtHelper: JwtHelperService,
    private adminService: AdminServiceService) { }

  singin(user:User){
  
    return this.http.post(`${this.URL}/user/singin`,user);
  }

  singup(user:Usuario){
    return this.http.post(`${this.URL}/user/singup`,user);
  }

  //funcion para validar que hay un token
  isAuth():boolean{
    const token = localStorage.getItem('token');
    if(this.jwtHelper.isTokenExpired(token!) || !localStorage.getItem('token')){
      return false;
    }
    return true;
  }

  // eliminar token y cerrar cesion 
  logout() {
    localStorage.removeItem('token');
  }

  // resultados -- devuelve un observable 
  resultadosPublicacion(id:number){
    return this.http.get(`${this.URL}/user/resultados/publicacion/${id}`)
  }

  // resultados -- publicaciones de un usuario
  publicacionesUsuario(id:number){
    return this.http.get(`${this.URL}/user/publicaciones/usuario/${id}`)
  }

  // resultados -- comentarios de una publicacion
  obtenerComentarios(id:number){
    return this.http.get(`${this.URL}/user/publicacion/comentarios/${id}`)
  }

  // resultados -- obtener respuestas a comentarios 
  obtenerRespuestas(id:number): Observable<any>{
    return this.http.get<Respuesta[]>(`${this.URL}/user/publicacion/respuestas/${id}`)
  }
  
  obtenerNumeroComentarios(id:number){
    
    /*this.http.get(`${this.URL}/user/publicacion/totalComentarios/${id}`).subscribe(res =>{
      this.cont =Number(JSON.parse(res['total'])) 
      console.log(this.cont)
      return this.cont
    })*/
    return this.http.get<number>(`${this.URL}/user/publicacion/totalComentarios/${id}`)
  }

  // actualizar -- actualizar rating publicacion 
  actualizarRating(data:any){
    return this.http.post(`${this.URL}/user/publicacion/actualizar/rating`, data)

  }

  // obtener -- datos del usuario 
  datosUsuario(id:number){
    return this.http.get<Usuario>(`${this.URL}/user/datos/usuario/${id}`)
  }


  //actualizar datos usuario
  actualizarUsuario(usuario:Usuario){
    
    return this.adminService.actualizarUsuario(usuario)

  }


}
