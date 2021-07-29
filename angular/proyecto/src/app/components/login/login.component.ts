import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from 'src/app/modelos/user';
import { AuthService } from 'src/app/services/auth.service';
import decode from 'jwt-decode'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  styles: [`
        :host ::ng-deep .p-password input {
            width: 15rem
        }
    `],
  providers: [MessageService, ConfirmationService]

})
export class LoginComponent implements OnInit {

  user: User = new User();
  password: string;
  email: string;
  
  constructor(private authService: AuthService,
    private router: Router,
    private messageService: MessageService,) { }

  ngOnInit(): void {
    this.authService.logout()
  }

  login() {
    console.log(";Lega login ", this.user)
    this.authService.singin(this.user).subscribe((res: any) => {
      console.log("termina consulta ", res)
      if (res == "Usuario o clave incorrectos") {
        this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: res });
      } else {
        if (res == "El usuario se encuentra Inhabilitado") {
          this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: res });
        } else {
          localStorage.setItem('token', res.token);
          const data = JSON.parse(JSON.stringify(decode(localStorage.getItem('token')!)));
          
          /*this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
            this.router.navigate(['dashboard'])
          })*/
          
          if (data['rol'] == 'user') {
            //this.router.navigate(['dashboard'])
            this.router.navigate(['dashboard']).then(()=>{
              window.location.reload()
            })
            
          } else {
            this.router.navigate(['admin']).then(()=>{
              window.location.reload()
            })
          }
        }

      }
    })
    
  }
  registro() {
    this.router.navigate(['register'])
  }


}
