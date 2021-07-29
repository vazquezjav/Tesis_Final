import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import decode from 'jwt-decode'
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Usuario } from 'src/app/modelos/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [MessageService, ConfirmationService],
  styles: [`
        :host ::ng-deep .p-password input {
            width: 15rem
        }
    `]
})
export class PerfilComponent implements OnInit {
  usuario:Usuario = new Usuario()
  enviado: boolean;
  constructor(
      private authService: AuthService, 
      private router: Router,
      private confirmationService: ConfirmationService,
      private messageService: MessageService,
  ) { }

  ngOnInit(): void {
      
      //decodificar el token 
      const data = JSON.parse(JSON.stringify(decode(localStorage.getItem('token')!)));
      
      this.authService.datosUsuario(data['id_usuario']).subscribe(res=>{
        /*/this.usuario.id_usuario=res[0]['id_usuario']
        this.usuario.nombre_usuario=res[0]['nombre_usuario']
        this.usuario.email = res[0]['email']
        this.usuario.direccion_usuario = res[0]['direccion_usuario']
        console.log(res[0])*/
        this.usuario = res[0]
      })
  }
  guardar(){
    this.enviado = true;
    if(!this.usuario.email || !this.usuario.nombre_usuario || !this.usuario.password){
      this.messageService.add({severity:'warn', summary:'Por favor ingrese todos los datos'});
    }else{
      this.confirmationService.confirm({
        message: 'Esta seguro de los datos proporcionados',
        header: 'Confirmacion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.messageService.add({severity:'success', summary:'Actualizado correctamente'});
            this.authService.actualizarUsuario(this.usuario).subscribe(res =>{
              
              (async () => { 
                //console.log('before delay')
        
                await this.delay(1000);
                window.location.reload()
                //console.log('after delay')

            })();
            })
        },
        reject: (type) => {
            switch(type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({severity:'error', summary:'Rechazado', detail:'Correcion de datos'});
                break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({severity:'warn', summary:'Cancelado',});
                break;
            }
        }
    });
    }
    /**/
  }
 delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
  cancelar(){
    this.router.navigate(['dashboard'])
  }

}
