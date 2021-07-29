import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

import decode from 'jwt-decode'
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    public router: Router
  ){}
  //verificar que el rol esperado
  canActivate(route: ActivatedRouteSnapshot): boolean{
    const expectedRole = route.data.expectRole;
    
    if(!this.authService.isAuth()){
      
      this.router.navigate(['login'])
      return false;
    }else{
      const token = localStorage.getItem('token');
      //decodificar el token 
      
      const data = JSON.parse(JSON.stringify(decode(token!)));
      
      
      if(!this.authService.isAuth ||  data['rol'] !== expectedRole){
        
        this.router.navigate(['login'])
        return false;
      }
    }
    return true;
  }
  
}
