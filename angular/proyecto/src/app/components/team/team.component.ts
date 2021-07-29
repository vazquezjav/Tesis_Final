import { Component, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  events: any[];
  constructor() { }

  ngOnInit(): void {
    this.events = [
      {rol: 'Desarrollador', name: 'Javier Vazquez', detail:'Estudiante de la carrera de Ciencias de la Computacion en la Universidad Politécnica Salesiana, amante de las nuevas tecnologias y del aprendizaje continuo',  image: 'javier2.PNG', facebook:'https://www.facebook.com/profile.php?id=100004902013812', github:'https://github.com/vazquezjav', twitter:'https://twitter.com/javazq99'},
      {rol: 'Tutor', name: 'PhD. Gabriel Leon', detail:'Profesor e Investigador a tiempo completo de la Universidad Politécnica Salesiana Nivel Uno. Adscrito a la Carrera de Ingeniería de Sistemas. Titulo de Tercer Nivel. Ingeniero de Sistemas por la Universidad del Azuay. Titulación de Cuarto Nivel. Máster Universitario en Ingeniería Web por la Universidad Politécnica de Madrid, y Doctor en Tecnologías de Información por la Universidad de Guadalajara.', image:'gabriel.PNG', google:'https://scholar.google.com/citations?user=fIoURQwAAAAJ&hl=es', twitter:'https://twitter.com/Gabus_leon'},
      {rol: 'Grupo Investigacion', name: 'GIHP4C', detail:"El Grupo de Investigación en Cloud Computing, Smart Cities & High Performance Computing  (GIHP4C), de la Universidad Politécnica Salesiana, está conformado por docentes y estudiantes que realizan investigaciones acerca de la computación en la nube, internet de las cosas, minería de datos, procesamiento de imágenes y video, entre otros. Nuestro objetivo es generar conocimiento a través de la vinculación de la Universidad Politécnica Salesiana con la sociedad para que a través del uso de nuevas tecnologías de información y comunicaciones se mejore la calidad de vida de la sociedad apegados a los objetivos de la Universidad Politécnica Salesiana", facebook:'https://www.facebook.com/gihp4c', twitter:'https://twitter.com/Gihp4cUPS', image:'GIHP4C.png', page:'https://gihp4c.blog.ups.edu.ec/'},
      
  ];
  }

}
