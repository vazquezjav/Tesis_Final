import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js'
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Comentario } from 'src/app/modelos/comentarios';
import { ComentariosResultados } from 'src/app/modelos/comentariosResultados';
import { Publicacion } from 'src/app/modelos/publicacion';
import { Respuesta } from 'src/app/modelos/respuesta';

import { AuthService } from 'src/app/services/auth.service';

import * as FileSaver from 'file-saver';


import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css'],
  providers: [MessageService],
})


export class ResultadosComponent implements OnInit {
  @ViewChild('canva') private reaccionesCanvas: ElementRef;
  @ViewChild('canvaTopico') private topicosCanvas: ElementRef;
  

  publicacion: Publicacion = new Publicacion()

  iframe: String;
  iframe_iterativo: String;

  comentario: Comentario;
  respuesta: Respuesta;

  comenResultado: ComentariosResultados = new ComentariosResultados()
  comentariosResultados: ComentariosResultados[] = []

  // columnas exportar tipos archivos 
  cols: any[];
  exportColumns: any[];

  // grafico pie 
  data: any;
  barReacciones: any;
  barTopicos: any;
  
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get("id")
    this.resultadosPublicacion(Number(id))

    this.cols = [
      { field: 'comentario', header: 'comentario' },
      { field: 'sentimiento', header: 'centimiento' },
      { field: 'topico', header: 'topico' },
    ];

    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  graficarReportes(comentarios: ComentariosResultados[], publicacion: Publicacion) {
    this.graficarReacciones(publicacion);
    this.graficarTopicos(comentarios);
    this.graficarPorcentajeComentarios(comentarios)
  }



  graficarReacciones(publicacion: Publicacion) {
    var etiquetasBar: any[] = [];
    var valoresBar: any[] = [];
    if (publicacion.gusta != 0) {
      etiquetasBar.push('Me gusta 👍')
      valoresBar.push(publicacion.gusta)
    }
    if (publicacion.asombra != 0) {
      etiquetasBar.push('Me asombra 😮')
      valoresBar.push(publicacion.asombra)
    }
    if (publicacion.enoja != 0) {
      etiquetasBar.push('Me Enoja 😡')
      valoresBar.push(publicacion.enoja)
    }
    if (publicacion.encanta != 0) {
      etiquetasBar.push('Me Encanta 😍')
      valoresBar.push(publicacion.encanta)
    }
    if (publicacion.entristese != 0) {
      etiquetasBar.push('Me Enristese 😥')
      valoresBar.push(publicacion.entristese)
    }
    if (publicacion.alegra != 0) {
      etiquetasBar.push('Me alegra 😂')
      valoresBar.push(publicacion.alegra)
    }
    if (publicacion.importa != 0) {
      etiquetasBar.push('Me Importa ❤️')
      valoresBar.push(publicacion.importa)
    }

    this.barReacciones = new Chart(this.reaccionesCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: etiquetasBar,
        title: {
          text: "Reacciones"
        },
        datasets: [{
          label: 'Reacciones',
          data: valoresBar,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        plugins: {
          title: {
            display: true,
            text: 'Reacciones Publicaion'
          }
        },

      }
    });

  }
  graficarTopicos(comentarios: ComentariosResultados[]) {

    var topicos: number[] = [];
    for (let i in comentarios) {
      if (!topicos.includes(comentarios[i].topico)) {
        topicos.push(comentarios[i].topico)
      }
    }
    topicos = topicos.sort()
    var num_comentarios_topicos: any[] = [];
    for (let top in topicos) {
      var cont = 0;

      for (let i in comentarios) {
        if (comentarios[i].topico === topicos[top]) {
          cont += 1
        }
      }
      num_comentarios_topicos.push(cont)
    }
    var topicos_labels: any[] = [];
    for (let i in topicos) {
      topicos_labels.push("Topico #" + String(topicos[i]))
    }

    var colores: any[] = [];
    for (let i = 0; i < topicos.length; i++) {
      colores.push(this.getRandomColor())
    }

    this.barTopicos = new Chart(this.topicosCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: topicos_labels,
        title: {
          text: "Reacciones"
        },
        datasets: [{
          label: 'Comentarios ',
          data: num_comentarios_topicos,
          backgroundColor: colores,
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        plugins: {
          title: {
            display: true,
            text: 'Reacciones Publicaion'
          }
        },

      }
    });


  }

  graficarPorcentajeComentarios(comentarios: ComentariosResultados[]) {
    var positivo = 0;
    var negativo = 0;

    for (let i in comentarios) {

      if (comentarios[i]['sentimiento'] == 'Positivo') {
        positivo += 1;
      } else {
        negativo += 1;
      }
    }
    
    
    const canvas = <HTMLCanvasElement> document.getElementById('canvaPorcentajeComentarios');
    const ctx = canvas.getContext('2d');
    var chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          "Positivo 😀",
          "Negativo ☹️",
        ],
        datasets: [
          {
            data: [positivo, negativo],
            backgroundColor: [
              "#36A2EB",
              "#E55111",
              
            ],
            hoverBackgroundColor: [
              "#36A2EB",
              "#E55111",
              
            ]
          }
        ]
      },
      backgroundColor: "rgba(255,255,255,1)",
      options: {
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var allData = data.datasets[tooltipItem.datasetIndex].data;
              var tooltipLabel = data.labels[tooltipItem.index];
              var tooltipData = allData[tooltipItem.index];
              var total = 0;
              for (var i in allData) {
                total += allData[i];
              }
              var tooltipPercentage = Math.round((tooltipData / total) * 100);
              return tooltipLabel + ' Comentarios: ' + tooltipData + ' (' + tooltipPercentage + '%)';
            }
          }
        },
      },
      
    });

  }

  resultadosPublicacion(id: number) {
    this.authService.resultadosPublicacion(Number(id)).subscribe(data => {
      this.publicacion = data['0']
      this.iframe = this.publicacion.path_pyldavis
      this.iframe_iterativo = this.publicacion.path_tsne

      this.cambiarIframe()

      this.authService.obtenerComentarios(this.publicacion.id_publicacion).subscribe(
        data => {
          if (data == 'La publicacion no cuenta con comentarios') {
            console.log('vacio comentarios')

          } else {
            for (let i in data) {
              this.comentario = new Comentario();
              this.comentario = data[i]
              this.comenResultado = new ComentariosResultados();
              this.comenResultado.comentario = this.comentario.detalle_comentario
              this.comenResultado.sentimiento = this.comentario.sentimiento;
              this.comenResultado.topico = Number(this.comentario.num_topico);
              this.comentariosResultados.push(this.comenResultado);
            }

            this.authService.obtenerRespuestas(this.publicacion.id_publicacion).subscribe(data => {
              if (data == 'La publicacion no cuenta con respuestas a comentarios') {
                this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'Su publicacion no cuenta con respuestas a comentarios' });
              } else {
                for (let i in data) {
                  this.respuesta = new Respuesta();
                  this.respuesta = data[i];
                  this.comenResultado = new ComentariosResultados();
                  this.comenResultado.comentario = this.respuesta.detalle_respuesta;
                  this.comenResultado.sentimiento = this.respuesta.sentimiento;
                  this.comenResultado.topico = Number(this.respuesta.num_topico);
                  this.comentariosResultados.push(this.comenResultado);
                }
              }

              this.graficarReportes(this.comentariosResultados, this.publicacion)
            }
            );

          }

        })

    });
  }


  cambiarIframe() {
    (<HTMLIFrameElement>document.getElementById('iframe')).src = String(this.iframe);
    (<HTMLIFrameElement>document.getElementById('iframe_iterativo')).src = String(this.iframe_iterativo);
  }

  cambios() {

    const actualizarRating = {
      id: this.publicacion.id_publicacion,
      rating: this.publicacion.rating
    }
    this.authService.actualizarRating(actualizarRating).subscribe(respuesta => {
      //console.log(respuesta)
    })
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  exportExcel() {

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.comentariosResultados);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "primengTable");
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  exportpdf() {
    var columns = [['Comentario', 'Sentimiento', 'Topico']]
    var coments: any[] = [];
    for (let i in this.comentariosResultados) {
      const aux = [this.comentariosResultados[i]['comentario'], this.comentariosResultados[i]['sentimiento'], this.comentariosResultados[i]['topico']]
      coments.push(aux)
    }

    var doc = new jsPDF.jsPDF();

    doc.setFontSize(18);
    doc.text('Comentarios Analisis', 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);
    //doc.addImage('http://localhost/tesis/imagenTopics/topics_4_38.png', 15, 40, 50, 50);


    (doc as any).autoTable({
      head: columns,
      body: coments,
      theme: 'plain',
      didDrawCell: data => {
        //console.log(data.column.index)
      }
    })
    var canvas = <HTMLCanvasElement> document.getElementById('canvaPorcentajeComentarios');
    var imageSentiments = canvas.toDataURL("image/png", 1.0);

    var canvasTopics = <HTMLCanvasElement> document.getElementById('canvaTopico');
    var imageTopics = canvasTopics.toDataURL("image/png", 1.0);

    doc.addPage()
    doc.setFontSize(18);
    doc.text('Distribucion Sentimientos', 11, 8);
    doc.addImage(imageSentiments, 5, 5, 250, 110);
    doc.text('Distribucion Topicos', 11,115 );
    doc.addImage(imageTopics, 5, 120, 200, 110);
    doc.save('comentarios.pdf');
  }

}
