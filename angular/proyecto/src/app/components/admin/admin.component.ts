import { Component, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Usuario } from 'src/app/modelos/usuario';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [MessageService, ConfirmationService]
})

export class AdminComponent implements OnInit {

  usuarios: Usuario[] = []
  users: Usuario[];
  usuario: Usuario = new Usuario()
  usuarioDialogo: boolean;
  enviado: boolean;
  habilitado: boolean;
  roles: any[];

  tipo_crud:number = 0;
  constructor(
    private adminService: AdminServiceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarios()
    this.adminService.obtenerUsuarios2().subscribe(res => {
      
      this.users = res
    })
    this.roles = [
      { label: 'Usuario', value: 'user' },
      { label: 'Administrador', value: 'admin' }
    ];
    
  }

  obtenerUsuarios():Usuario[] {
    this.adminService.obtenerUsuarios().subscribe(res => {
      for (let i in res) {
        this.usuario = res[i]
        this.usuarios.push(this.usuario)
      }
    })
    return this.usuarios
  }

  editUsuario(usuario: Usuario) {
    
    this.usuario = { ...usuario };
    if (this.usuario.estado == 'Habilitado') {
      this.habilitado = true;
    } else {
      this.habilitado = false;
    }
    //this.habilitado = true;
    this.usuarioDialogo = true
    this.tipo_crud = 1;
  }
  cerrar() {
    this.usuarioDialogo = false;
    this.enviado = false;
  }
  actualizar() {
    this.enviado = true;
    this.confirmationService.confirm({
      message: 'Esta seguro de los datos proporcionados',
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.habilitado == true) {
          this.usuario.estado = 'Habilitado'
        } else {
          this.usuario.estado = 'Inhabilitado'
        }

        if(this.tipo_crud ==1){
          this.messageService.add({ severity: 'success', summary: 'Actualizado correctamente'});
          
          this.usuarioDialogo = false;
  
          this.adminService.actualizarUsuario(this.usuario).subscribe(res => {
          })
          
        }else{
          
          
          this.adminService.agregarUsuario(this.usuario).subscribe(res=>{
            this.messageService.add({ severity: 'success', summary: 'Agregado correctamente' });
          })
          
          this.usuarioDialogo = false;
        }
        
        this.usuarios = []
        this.usuario = new Usuario()
        this.usuarios = this.obtenerUsuarios()
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Correcion de datos' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelado', });
            break;
        }
      }
    });
  }

  agregarUsuario(){
    this.usuario = new Usuario();
    this.habilitado = true;
    this.usuarioDialogo = true
    this.tipo_crud = 0;
  }

  


}
