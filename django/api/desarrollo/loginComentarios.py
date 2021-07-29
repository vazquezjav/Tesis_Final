# -*- coding: utf-8 -*-
"""
Created on Tue Apr 27 12:47:15 2021

@author: vazqu
"""

from bs4 import BeautifulSoup as bs4
import requests 
from unidecode import unidecode
import re

from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.keys import Keys

class loginComentarios:
    
    def __init__(self,url, email, pas):
         #self.id_facebook=id_facebook
         self.htmls=[]
         self.total=0
         self.url_respuestas=[]
         self.browser=self.login(email, pas)
         self.id_facebook = self.obtenerID(url)
         self.comentario_anterior=0
         self.respuesta=self.vector_respuestas_comentarios(100)
         
         self.comentarios_dic={}
         self.respuestas_dic={}
         
       

    def login(self, email, pas):
        
        chrome_options =  Options()
        chrome_options.add_argument("--headless")
        

        browser = webdriver.Firefox(executable_path="/home/lda/tesis_Javier-Vazquez/django/api/desarrollo/selenium/geckodriver", options=chrome_options)
        browser.get('https://mbasic.facebook.com')
        
        username = browser.find_elements_by_css_selector("input[name=email]")
        username[0].send_keys(email)
        password = browser.find_elements_by_css_selector("input[name=pass]")
        password[0].send_keys(pas)

        loginButton = browser.find_elements_by_css_selector("input[type=submit]")
        loginButton[0].click()
        
        return browser
        
    def obtenerID(self, url):
        self.browser.get('https://commentpicker.com/facebook-post-id-finder.php')

        inputURL = self.browser.find_elements_by_css_selector("input[id=facebook-post-url]")
        inputURL[0].send_keys(url)

        df = self.browser.find_element_by_xpath("//*[@id='facebook-post-url']")
        df.send_keys(Keys.TAB*2, Keys.ENTER)

        text= self.browser.find_element_by_id("js-result")
        return text.text
         
    def separar_id_pagina_comentarios(self, url):
        #global respuesta_comentarios
        split = url.split("=")
        id_estr=int(re.search(r'\d+', split[1]).group()) #separar numeros de string
        return id_estr
    def obtener_id_publicacion(self, url):
        return url.split("/")[-2]

    def encontrar_class_comentarios(self, html):
        selector = 'div > h3 ~ div'
        found = html.select(selector)
        sp=str(found[0]).split('"')
        return sp[1]

    def vector_respuestas_comentarios(self, maximo):
        #crear un vector con el maximo de respuestas de un comentario 
        respuesta=['1 reply',]
        for j in range(2,maximo+1):
            respuesta.append(str(j)+' replies')
            #[str(j)+' respuestas' for j in range(2,maximo+1)]
        return respuesta

    def obtener_comentarios_respuesta_comentarios(self, url):
        #mediante web scraping optener las respuestas de los comentarios 
        #recibe la url previamente obtenida que nos direcciona a la pagina de respuestas a un comentario
        
        self.browser.get(url)
        res=self.browser.page_source
        soup =bs4(res , 'html.parser')
        
        filtrado=soup.findAll('div', {'class':self.encontrar_class_comentarios(soup)})
        users, urls = self.encontrar_nombre_usuarios(soup, 0)
        respuestas=[]
        for i in range(1,len(filtrado)):
            self.total +=1
            if not filtrado[i].text =='':
                datos_usuario =[users[i],filtrado[i].text,urls[i]]
                respuestas.append(datos_usuario)
                
        self.respuestas_dic[filtrado[0].text]=respuestas
        
        tags_a=soup.findAll("a")
        for i in tags_a:
            if i.text =='View previous replies':
                url_respuestas_anteriores='https://mbasic.facebook.com'+i['href']
                self.obtener_comentarios_respuesta_comentarios(url_respuestas_anteriores)
            
    def urls_respuestas_comentarios(self,html):
        #devuelve la lista de url de las respuestas de los comentarios 
        #respuesta=self.vector_respuestas_comentarios(50)
        url_respuestas=[]
        try:
            tags_a=html.findAll("a")
            for i in tags_a:
                #print("Ete a = ",i.text)
                if i.text in self.respuesta:
                    if not i['href'] in url_respuestas:
                        url_respuestas.append('https://mbasic.facebook.com'+i['href'])
        except:
            #print("No hay mas respuestas")
             c = ''
        return url_respuestas
    
    
    def obtener_comentarios_anteriores(self, url):
        self.browser.get(url)
        res=self.browser.page_source
        soup =bs4(res , 'html.parser')
        #print("Comentarios anteriores = ", self.comentario_anterior)

        try:
            comments = soup.findAll('div', {'class':self.encontrar_class_comentarios(soup)})
            users, urls= self.encontrar_nombre_usuarios(soup, 1)
            for i in range(0, len(comments)):
                self.total +=1
                if not comments[i].text=='':
                    #datos_usuario=[users[i],comments[i].text, urls[i]]
                    datos_ususario_dic=[users[i], urls[i]]
                    self.comentarios_dic[comments[i].text]= datos_ususario_dic
                    #self.comentarios.append(datos_usuario)
        except:
            #print("No mas comentarios")
            c=''
        
        self.comentario_anterior +=1
        try:
            tags_a=soup.findAll("a")
            for i in tags_a:
                text=unidecode(i.text)
                sep=i.text.split("·")  
                
                #cuando el formota del comentario es asi 'Web On Duque replied · 1 reply'
                if len(sep) >1:
                    tt=sep[1]
                    tt=tt[1:] #eliminar primer caracter
                    if tt in self.respuesta:
                        if not i['href'] in self.url_respuestas:
                            self.url_respuestas.append('https://mbasic.facebook.com'+i['href'])
                    
                if i.text in self.respuesta:
                    if not i['href'] in self.url_respuestas:
                        self.url_respuestas.append('https://mbasic.facebook.com'+i['href'])
                        
                if text ==' View previous comments...':
                    url_anterior='https://mbasic.facebook.com'+i['href']
                    self.obtener_comentarios_anteriores(url_anterior)
                   
        except:
            #print('')
             c = ''
            
    def encontrar_nombre_usuarios(self, html, pagina):
        selector = 'h3 a '
        found = html.select(selector)
        cont_1=0
        users=[]
        url=[]
        for i in found:
            #print(i,"\n")
            if pagina ==0: #unicamente para la primera pagina de comentarios
                users.append(i.text)
                url.append("https://www.facebook.com"+i['href'])
            else:
                if cont_1 >0:            
                    users.append(i.text)
                    url.append("https://www.facebook.com"+i['href'])
            cont_1 +=1
        return users, url

    def obtener_reacciones(self,url):
        
        self.browser.get(url)
        res =self.browser.page_source
        soup2 =bs4(res , 'html.parser')
        
        reac = soup2.findAll('span', {'class':'_10tn'})
        alegra,asombra,encanta,entristese,importa,like,enoja=0,0,0,0,0,0,0
        for i in reac:
            if i['data-store'] =='{"reactionType":4}':
                alegra=i.text
            if i['data-store'] =='{"reactionType":3}':
                asombra=i.text
            if i['data-store'] =='{"reactionType":2}':
                encanta=i.text
            if i['data-store'] =='{"reactionType":7}':
                entristese=i.text
            if i['data-store'] =='{"reactionType":16}':
                importa=i.text
            if i['data-store'] =='{"reactionType":1}':
                like=i.text
            if i['data-store'] =='{"reactionType":8}':
                enoja=i.text
        reacciones=[alegra,asombra,encanta,entristese,importa,like,enoja]
       
        return reacciones
    def obtener_comentarios(self):
        #id='3979298638823457'
        url='https://mbasic.facebook.com/'+self.id_facebook
        cont =0
        cont2 = 0
        cont_reacciones=0
        more_comments=''
        id_siguiente, id_anterior = 0,0
        lista_urls=[]
        #respuesta=self.vector_respuestas_comentarios(100)
        nombre_publicacion=''
        path_img = ''
        while True:
            if cont >1:
                if  url in lista_urls:
                    #print("entra salir")
                    break
            #res =requests.get(url)
            #print(url)
            self.browser.get(url)
            res=self.browser.page_source
            soup =bs4(res , 'html.parser')
            lista_urls.append(url)
            #print("Url actual = ",url,"\n")
            if cont==0:
                titulo=soup.title.string
          
            self.htmls.append(soup)
            # para encontrar el link de direccionamiento hacia los otros comentarios 
            # en base a la etiqueta 'a' 
            try:
                tags_a=soup.findAll("a")
            except:
                    break
            for i in tags_a:
                text=unidecode(i.text)
                if text ==' View more comments...':
                    if cont2 == 0:
                        more_comments=i['href']
                    cont2 += 1
                
                # solamente si es la primera pagina y tiene comentarios anteriores 
                if cont ==0:
                    if i['href'].startswith('/ufi/reaction') and cont_reacciones==0:
                        url_reaccion='https://m.facebook.com'+i['href']
                        reacciones=self.obtener_reacciones(url_reaccion)
                        cont_reacciones +=1
                    
                    if text ==' View previous comments...':
                        url_anterior='https://mbasic.facebook.com'+i['href']
                        self.obtener_comentarios_anteriores(url_anterior)

                    sep = i.text.split("·")
                    # cuando el formota del comentario es asi 'Web On Duque replied · 1 reply'
                    if len(sep) > 1:
                        tt = sep[1]
                        tt = tt[1:]  # eliminar primer caracter
                        if tt in self.respuesta:
                            if not i['href'] in self.url_respuestas:
                                self.url_respuestas.append('https://mbasic.facebook.com' + i['href'])

                if cont == 0:
                    tags_img = soup.findAll("img")
                    cont_img = 0
                    for tag in tags_img:
                        if cont_img == 1:
                            path_img = tag['src']
                        cont_img += 1

                    
                if i.text in self.respuesta:
                    if not i['href'] in self.url_respuestas:
                        self.url_respuestas.append('https://mbasic.facebook.com'+i['href'])
            cont +=1
            cont2 =0 #reiniciamos contador para obtener el url de la siguiente pagina 'ver mas comentarios'
            if more_comments.startswith('https://mbasic.facebook.com'):
                url = more_comments
            else:
                url = 'https://mbasic.facebook.com' + more_comments
    
            #print("Comentarios pagina = ",cont+1," \n")
        
        return titulo, reacciones, path_img
            
    def obtener_comentarios_paginas(self):
        #print("Obteniedo comentarios paginas ")
        cont_com=0
        for j in self.htmls:
            try:
                comments = j.findAll('div', {'class':self.encontrar_class_comentarios(j)})
                users, urls = self.encontrar_nombre_usuarios(j, cont_com)
                for i in range(0,len(comments)):
                    self.total +=1
                    if not comments[i].text =='':
                        datos_usuario_dic=[users[i],urls[i]]
                        self.comentarios_dic[comments[i].text]=datos_usuario_dic
                
            except:
                break
            cont_com += 1
            
        return self.comentarios_dic
    
    def guardar_respuesta_comentarios(self):
        #print("Obteniendo comentarios respuestas")
        if  self.url_respuestas != []:
            for i in self.url_respuestas:
                self.obtener_comentarios_respuesta_comentarios(i)
        
        
        #eliminar memoria y brower
        
        #del .....eliminar cosas en memoria
        
        self.browser.close()
        self.concatenar_diccionarios()
        return self.total, self.respuestas_dic, self.id_facebook

    
    def concatenar_diccionarios(self):
        for key in self.comentarios_dic:
            if key in self.respuestas_dic:
                self.comentarios_dic[key].append(self.respuestas_dic[key])
