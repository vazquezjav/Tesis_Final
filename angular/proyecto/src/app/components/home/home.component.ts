import { Component, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  events: any[];
  constructor() { }

  ngOnInit(): void {
    this.cargarDatos()
  }

  cargarDatos(){
    this.events = [
      {status: 'Que somos ', icon: PrimeIcons.FACEBOOK, color: '#9C27B0', field:'Somos una herramienta que se basa en las opiniones de los usuario dentro de una de las grandes redes sociales como es Facebook' },
      {status: 'Servicios', icon: PrimeIcons.COG, color: '#673AB7', field:'Ofrecemos una herramienta que permita analizar y tomar deciones a alas empresas acerca de sus productos publicados en redes sociales basado en la aceptacion que a tenido el mismo por parte de los usuarios', url:'dashboard'},
      {status: 'Resultados',  icon: PrimeIcons.SITEMAP, color: '#FF9800', field:'Los resultados de los analisis de las publicaciones permiten a las empresas tomar decisiones acerca de estos productos. En la que se puede analizar cual a sido el sentimiento de cada usuario respecto al producto'},
      {status: 'Equipo Desarrollo',icon: PrimeIcons.USERS, color: '#607D8B', field:'Nuestro equipo de desarrollo esta conformado por el estudiante Javier Vazquez y el PhD. Gabriel Leon'}
  ];
  }

}
