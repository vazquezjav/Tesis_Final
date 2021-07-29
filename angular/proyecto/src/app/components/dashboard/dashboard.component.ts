import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import decode from 'jwt-decode'
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { Comentario } from 'src/app/modelos/comentarios';
import { Publicacion } from 'src/app/modelos/publicacion';
import { Usuario } from 'src/app/modelos/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { DjangoService } from 'src/app/services/django.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class DashboardComponent implements OnInit {
  data = JSON.parse(JSON.stringify(decode(localStorage.getItem('token')!)));
  
  numero_topics: number = 0
  url: String;
  visi: boolean = true;

  value: number = 0;
  publicaciones: Publicacion[] = [];
  publicacion: Publicacion= new Publicacion();
  

  comentarios: Comentario[] = []

  
  cont: any[]=[];

  usuario:Usuario = new Usuario();
  results: Observable<any>;

  displayModal: boolean;
  enviado:boolean;
  constructor(
    private djangoService: DjangoService,
    public message: MessageService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit():void{
    
    this.data
    this.obtenerUsuario(Number(this.data['id_usuario']))
    this.obtenerPublicaciones();
    this.results = this.authService.datosUsuario(Number(this.data['id_usuario']));

   
    
  }
  obtenerUsuario(id:number){
   this.authService.datosUsuario(id).subscribe((res:Usuario)=>{
    
     this.usuario = res[0]
     
     return res
   })

  }

  obtenerPublicaciones(){
    //this.spinnerService.show();
    this.authService.publicacionesUsuario(Number(this.data['id_usuario'])).subscribe(res => {
      if (res == 'El usuario aun no cuenta con publicaciones') {
        this.displayModal = true;
      } else {
        for (let d in res) {
          this.publicacion = new Publicacion();
          this.cont = []
          this.publicacion = res[d]
          this.publicacion.reacciones = this.publicacion.alegra + this.publicacion.asombra + this.publicacion.encanta + this.publicacion.entristese + this.publicacion.importa + this.publicacion.gusta + this.publicacion.enoja
          
          this.publicaciones.push(this.publicacion)
        }
      }
    });
  }

  analizarPublicacion() {
    const datos_post = {
      id_usuario: this.data['id_usuario'],
      url: this.url,
      num_topics: this.numero_topics
    }
    
    this.djangoService.analizar_post(datos_post).subscribe((res: any) => {
      
      const respuesta = JSON.parse(JSON.stringify(res));
      
      if(respuesta['Mensaje']=="Error durante el procesamiento"){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'A ocurrido un error, lo sentimos mucho ' });
      }else{
        this.router.navigate(['resultados', Number(respuesta['id_publicacion'])])
      }
      
    })

  }
  mensaje(mode: string, mensaje: string) {
    this.message.add({ severity: mode, summary: mensaje })
  }

  resultadoPublicacion(publicacion: Publicacion) {
    this.router.navigate(['resultados', publicacion.id_publicacion])

  }
  analizar() {
    this.enviado = true;
    if (!this.url || !this.numero_topics){
      this.messageService.add({ severity: 'warn', summary: 'Por favor ingrese todos los datos' });
    }else{
      if(this.url.includes('facebook.com')){
        this.confirmationService.confirm({
          message: 'Esta seguro de los datos proporcionados',
          header: 'Confirmacion',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Analizando', detail: 'Por favor espere' });
            
            this.analizarPublicacion()
          },
          reject: (type) => {
            switch (type) {
              case ConfirmEventType.REJECT:
                this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Correcion de datos', icon:'pi-facebook' });
                break;
              case ConfirmEventType.CANCEL:
                this.messageService.add({ severity: 'warn', summary: 'Cancelado', });
                break;
            }
          }
        });
      }else{
        this.messageService.add({ severity: 'warn', detail:'Por favor corrija la informacion ', summary: 'No es una pagina de facebook' });
        
      }
    }
    
  }


  vistaRapida(id: number) {
    this.comentarios = []
    this.authService.obtenerComentarios(id).subscribe(data => {
      if (data == 'La publicacion no cuenta con comentarios') {
        console.log('vacio comentarios')
      } else {
        for (let i in data) {
          this.comentarios.push(data[i])
          //this.coment.push(data[i])
        }
      }
    })
  }


  mensajeContacto(){
    
    this.messageService.add({ severity: 'info', summary: 'Enviado', detail: 'El equipo de desarrollo pronto se contactara con usted' });
  }


}
