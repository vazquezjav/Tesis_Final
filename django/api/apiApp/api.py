from rest_framework.response import Response
from .serializers import UserSerializer, Book, Facebook
from rest_framework.views import APIView
from rest_framework import status

from desarrollo.loginComentarios import loginComentarios
from .apps import CargarCosas
from desarrollo.LimpiezaPLN import Procesamiento
from desarrollo.LDA import ModeloLDA

import warnings
warnings.filterwarnings("ignore")

class UserApi(APIView):

    def post(self, request):
        serializer = UserSerializer( data = request.data)

        if serializer.is_valid():
            user = serializer.save()
            print("valido")

class BookApiView(APIView):
    def get(self,request):
        allBooks=Book.objects.all().values()
        return Response({"Message":"List of Books", "Book List":allBooks})

    def post(self,request):
        Book.objects.create(id=request.data["id"],
            title = request.data["title"],
            author = request.data["author"]
                )
        book=Book.objects.all().filter(id=request.data["id"]).values()
        return Response({"Message":"New Book Added!", "Book":book})

class FacebookApi(APIView):

    def post(self, request):
        print("ID USUARIO = ", request.data['id_usuario']," | ", request.data['url'], " | ",request.data['num_topics'])
        url=request.data['url']
        id_usuario = request.data['id_usuario']

        try:
            publicacion = Metodos.main(url, id_usuario, request.data['num_topics'])
            return Response({"Mensaje": "Procesado", "id_publicacion": publicacion})
        except:
            return Response({"Mensaje": "Error durante el procesamiento"})


class Metodos(object):
     # cargar archivos necesarios del modelo RNN

    @classmethod
    def main(self, url, id_usuario, num_topics):
        #url = 'https://www.facebook.com/permalink.php?story_fbid=126541632901655&id=107565374799281&comment_id=127945762761242&notif_id=1623470367091416&notif_t=feed_comment&ref=notif'
        email = 'tesis.lda.2021.ups@gmail.com'
        pas = 'ldaprojects.2021'
        publicacion = self.loginComentario(email, pas, url, id_usuario)
        
        lemantizado, comentarios, contadores_comentarios, id_comentarios, id_respuestas,topicos_comentarios = self.lda(publicacion, num_topics)  # obtener topicos LDA
        
        sentimientos = self.predecirSentimiento(lemantizado, comentarios)

        self.actualizarSentimientoTopicoBase(sentimientos,topicos_comentarios, id_comentarios, id_respuestas, contadores_comentarios,publicacion)
        return publicacion

    @classmethod
    def guardarBase(self,sql, datos, tipo):
         #### guardar publicacion

        if tipo == 0:
            cursor = CargarCosas.conexion.guardar(sql, datos, tipo)
            
            return cursor.lastrowid
        if tipo == 1:
            cursor = CargarCosas.conexion.guardar(sql, datos, tipo)
        if tipo == 2:
            return CargarCosas.conexion.guardar(sql, 0, tipo)
        if tipo == 3:
            return CargarCosas.conexion.guardar(sql, datos, tipo)

    @classmethod
    def loginComentario(self,email, pas, url, id_usuario):

        log = loginComentarios(url, email, pas)
        nombre_publicacion, reacciones, path_imagen = log.obtener_comentarios()
        com_dic = log.obtener_comentarios_paginas()

        total, res, id_face = log.guardar_respuesta_comentarios()
        
        val = []
        comentario_respuestas = []

        url_publicacion = 'https://www.facebook.com/' + id_face
        datos = (
        id_face, nombre_publicacion, url_publicacion, reacciones[0], reacciones[1], reacciones[2], reacciones[3],
        reacciones[4], reacciones[5], reacciones[6], id_usuario,path_imagen)
        
        id_publicacion = self.guardarBase("INSERT INTO publicacion (id_facebook,nombre_publicacion,url_publicacion,alegra,asombra,encanta,entristese,importa,gusta,enoja,id_usuario,imagen_publicacion) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
             datos, 0)
        print("id publicacion base", id_publicacion)
        for key in com_dic:
            if len(com_dic[key]) > 2:

                dato = (com_dic[key][0], key, com_dic[key][1], id_publicacion)
                id_com = self.guardarBase("INSERT INTO comentarios (nombre_usuario,detalle_comentario, perfil_usuario_comentario, id_publicacion) VALUES (%s,%s,%s,%s)",
                     dato, 0)

                if len(com_dic[key][2]) >= 1:
                    for i in com_dic[key][2]:
                        dato_respuesta = (i[0], i[1], i[2], id_com)
                        comentario_respuestas.append(dato_respuesta)

                else:
                    for i in com_dic[key][2]:
                        dato_respuesta = (i[0], i[1], i[2], id_com)
                        cursor = self.guardarBase("INSERT INTO respuesta_comentarios (nombre_usuario,detalle_respuesta, perfil_usuario_respuesta, id_comentario) VALUES (%s,%s,%s,%s)",
                             dato_respuesta, 0)
            else:
                dato = (com_dic[key][0], key, com_dic[key][1], id_publicacion)
                val.append(dato)
        
        cursor = self.guardarBase("INSERT INTO respuesta_comentarios (nombre_usuario,detalle_respuesta, perfil_usuario_respuesta, id_comentario) VALUES (%s,%s,%s,%s)",
             comentario_respuestas, 1)
        cursor = self.guardarBase("INSERT INTO comentarios (nombre_usuario,detalle_comentario, perfil_usuario_comentario, id_publicacion) VALUES (%s,%s,%s,%s)",
             val, 1)
        return id_publicacion

    @classmethod
    def lda(self,id_publicacion, num_topics):

         com = self.guardarBase(
             ('SELECT id_comentario, detalle_comentario from comentarios where id_publicacion=' + str(id_publicacion)),
             0, 2)
         res = self.guardarBase(('SELECT r.id_respuesta_comentarios, r.detalle_respuesta from comentarios c, respuesta_comentarios r where c.id_publicacion=' + str(
                                   id_publicacion) + ' and c.id_comentario= r.id_comentario'), 0, 2)
         comentarios = []

         id_comentarios, id_respuestas = [], []
         cont_comentarios, cont_respuestas = 0, 0
         for x in com.fetchall():
             comentarios.append(x[1])
             id_comentarios.append(x[0])
             cont_comentarios += 1
         for i in res.fetchall():
             comentarios.append(i[1])
             id_respuestas.append(i[0])
             cont_respuestas += 1
         
         #### LIMPIEZA COMENTARIOS -PLN
         lim = Procesamiento(comentarios)
         token, stem, leman = lim.limpieza()
         
         #### LDA
         lda = ModeloLDA(leman, comentarios)
         path_topics, pathpyldavis, path_tsne, topicos_comentarios = lda.modelo(num_topics, id_publicacion)
         data = (path_topics, pathpyldavis,path_tsne, id_publicacion)
         self.guardarBase("UPDATE publicacion SET path_ldatopics =%s,path_pyldavis =%s, path_tsne=%s WHERE id_publicacion= %s", data, 3)
         return leman, comentarios, [cont_comentarios, cont_respuestas], id_comentarios, id_respuestas, topicos_comentarios

    @classmethod
    def predecirSentimiento(self,lemantizado, comentarios):

         leman = [" ".join(i) for i in lemantizado]
         sentimientos = []

         lim = Procesamiento(comentarios)

         for text in leman:
             if text is '':
                 sen = 'Vacio'
             else:
                 text = lim.remover_caracteres(text)
                 sen = CargarCosas.modelo.predecirSentimiento(text)


             sentimientos.append(sen)

         return sentimientos

    @classmethod
    def actualizarSentimientoTopicoBase(self, sentimientos,topicos_comentarios, id_comentarios, id_respuestas, contadores_comentarios,id_publicacion):
         print("\n ACTUALIZAR BASEEEE \n")
         sql = "UPDATE comentarios SET sentimiento = %s WHERE id_comentario = %s"

         # Actualizar sentimiento tabla comentarios
         aux = 0
         for i in range(contadores_comentarios[0]):
             # print(" | ", sentimientos[i])
             data = (sentimientos[i], id_comentarios[aux])
             self.guardarBase("UPDATE comentarios SET sentimiento = %s WHERE id_comentario = %s", data, 3)
             aux += 1

         # actualizar sentimiento tabla respuesta comentarios
         aux = 0
         for j in range(contadores_comentarios[0], len(sentimientos)):
             data = (sentimientos[j], id_respuestas[aux])
             # print(" ",sentimientos[j]," | ",id_respuestas[aux] )
             self.guardarBase("UPDATE respuesta_comentarios SET sentimiento = %s WHERE id_respuesta_comentarios = %s", data,3)
             aux += 1

         # Actulizar topico tabla comentarios
         aux = 0
         for i in range(contadores_comentarios[0]):
             data = (topicos_comentarios[i]+1, id_comentarios[aux])
             self.guardarBase("UPDATE comentarios SET num_topico = %s WHERE id_comentario = %s", data, 3)
             aux += 1

         # Actualizar stopico tabla respuesta cometnarios
         aux = 0
         for j in range(contadores_comentarios[0], len(topicos_comentarios)):
            data = (topicos_comentarios[j]+1, id_respuestas[aux])
            # print(" ",sentimientos[j]," | ",id_respuestas[aux] )
            self.guardarBase("UPDATE respuesta_comentarios SET num_topico = %s WHERE id_respuesta_comentarios = %s", data, 3)
            aux += 1

         # Actualizar numero comentarios de la tabla publicacion
         data = (len(topicos_comentarios), id_publicacion)
         self.guardarBase("UPDATE publicacion SET num_comentarios = %s WHERE id_publicacion = %s", data, 3)

         # Actualizar rating - aceptacion tabla publicacion
         positivo = 0
         negativo = 0
         for i in sentimientos:
             if i == 'Positivo':
                 positivo += 1
             else:
                 negativo += 1
         porcentaje = (positivo * 100) / (positivo + negativo)
         if porcentaje <= 15:
             rating = 1
         elif porcentaje > 15 and porcentaje <= 40:
             rating = 2
         elif porcentaje > 40 and porcentaje <= 60:
             rating = 3
         elif porcentaje > 60 and porcentaje <= 80:
             rating = 4
         elif porcentaje > 80:
             rating = 5
         data2 = (rating, id_publicacion)
         self.guardarBase("UPDATE publicacion SET rating = %s WHERE id_publicacion = %s", data2, 3)
