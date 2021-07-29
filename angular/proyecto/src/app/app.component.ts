import { Component, Injectable } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api'
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from './modelos/usuario';
import { BehaviorSubject } from 'rxjs';
import decode from 'jwt-decode'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FooterComponent } from './components/footer/footer.component';
@Injectable()
export class DataSharingService {
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  

  items: MenuItem[];
  activateItem: MenuItem;
  usuario: Usuario = new Usuario()
  login: boolean;
  menuItems: Array<MenuItem> = []
  isUserLoggedIn: boolean;
  nombreUsuario:string;
  isAdmin:boolean;
  constructor(private authService: AuthService,
    private router: Router) {
  }
  ngOnInit() {
    this.verificarLogin();
    this.menu();
    
  }
  verificarLogin() {
    if (this.authService.isAuth()) {
      const data = JSON.parse(JSON.stringify(decode(localStorage.getItem('token')!)));
      this.authService.datosUsuario(data['id_usuario']).subscribe(res => {
        this.usuario = res[0]
        this.login = true
        this.nombreUsuario = res[0]['nombre_usuario']
        if(this.usuario.rol =='admin'){
          this.isAdmin = true;
        }else{
          this.isAdmin = false;
        }
      })

    } else {
      this.login = false
    }
  }
  verificarToken(){
    
  }
  menu() {
    
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: 'home'
      },
      {
        label: 'Dashboard',
        visible: this.login,
        icon: 'pi pi-fw pi-pencil',
        routerLink: 'dashboard'
      },
      {
        label: 'Registrarse',
        icon: 'pi pi-fw pi-plus',
        routerLink: 'register',
        visible: this.login ==false,
      },
      {
        label: 'Perfil',
        icon: 'pi pi-fw pi-user-edit',
        routerLink: 'perfil',
        visible: this.login
      },
      {
        label: 'Cerrar Sesion',
        icon: 'pi pi-fw pi-sign-out',
        routerLink: 'home',
        visible: this.login,
        command :()=>this.cerrarSesion(),
        
      },
      {
        label: 'Iniciar Sesion',
        icon: 'pi pi-fw pi-sign-in',
        routerLink: 'login',
        visible: this.login == false
      },
      { 
        label: 'Administrador',
        icon: 'pi pi-fw pi-user-plus',
        routerLink: 'admin',
        visible: this.isAdmin == true
      }
     /* {
        label: 'Events',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
              {
                label: 'Save',
                icon: 'pi pi-fw pi-calendar-plus'
              },
              {
                label: 'Delete',
                icon: 'pi pi-fw pi-calendar-minus'
              },

            ]
          },
          {
            label: 'Archieve',
            icon: 'pi pi-fw pi-calendar-times',
            items: [
              {
                label: 'Remove',
                icon: 'pi pi-fw pi-calendar-minus'
              }
            ]
          }
        ],

      },*/
    ];
    this.activateItem = this.items[0];
  }

  cerrarSesion() {
    this.authService.logout()
    this.router.navigate(['home']).then(() => {
      window.location.reload()
    })
  }
  

  

}
