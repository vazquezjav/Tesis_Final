import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { User } from 'src/app/modelos/user';
import { Usuario } from 'src/app/modelos/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService,]
})
export class RegisterComponent implements OnInit {

  user: Usuario = new Usuario();
  usuarioLogin: User = new User();
  enviado: boolean;
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.authService.logout()
  }
  register() {
    this.enviado = true;

    if (!this.user.nombre_usuario || !this.user.direccion_usuario || !this.user.email || !this.user.password) {
      this.messageService.add({ severity: 'warn', summary: 'Por favor ingrese todos los datos' });
      
    } else {
      this.usuarioLogin.email = this.user.email;
      this.usuarioLogin.password = this.user.password;
      this.authService.singup(this.user).subscribe((res: any) => {

        this.authService.singin(this.usuarioLogin).subscribe((res: any) => {

          localStorage.setItem('token', res.token);
          this.router.navigate(['dashboard']).then(()=>{
            window.location.reload();
          });
        })
      })
    }

  }
}
