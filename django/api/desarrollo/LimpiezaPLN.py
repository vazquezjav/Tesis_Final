# -*- coding: utf-8 -*-
"""
Created on Thu May 13 12:31:50 2021

@author: vazqu
"""
import nltk
import pandas as pd
import string 
from unidecode import unidecode
import re
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
from nltk.stem.snowball import SnowballStemmer
import spacy

class Procesamiento():
    def __init__(self, comentarios):
        self.comentarios= comentarios
    
    def tokenizar(self, texto):
        texto = texto.lower()
        tokenizer = RegexpTokenizer(r'\w+')
        #token= nltk.tokenize.word_tokenize(texto)
        return tokenizer.tokenize(texto)
    
    def remover_url(self,text):
        url = re.compile(r'https?://\S+|www\.\S+')
        return url.sub(r'',text) 
    
    def remover_caracteres(self,texto):
        #llega formato [['texto']]
        #print(texto)
        
        texto = re.sub("[#$?,:;'¡!@#$%^&*()\[\]\{\}/<´>|`+=_-]1234567890", '', texto)
        texto = re.sub("\d+", '', texto)
        texto = re.sub("[àáâãäå]", 'a', texto)
        texto = re.sub("[èéêë]", 'e', texto)
        texto = re.sub("[ìíîï]", 'i', texto)
        texto = re.sub("[òóôõö]", 'o', texto)
        texto = re.sub("[ùúûü]", 'u', texto)
        texto=unidecode(texto)
        
        texto= re.sub(r'\^[a-zA-Z]\s+', ' ', texto) #eliminar caracteres simples
        return texto
    
    def remover_stop_words(self,textoTokenizado):
        stop_words = set(stopwords.words('spanish')) 
        return [word for word in textoTokenizado if word not in stop_words]
    
    def stemming(self, token):
        stemmer=SnowballStemmer("spanish",ignore_stopwords=False)
        datos=[]
        for i in token:
            d=[]
            for word in i:
                d.append(stemmer.stem(word))
            datos.append(d)
        return datos
    
    def lemantizar(self,datos):
        #python -m spacy download en_core_web_sm
        sp = spacy.load('es_core_news_md')
        lemantizado=[]
        for i in datos:
            doc=[]
            for j in i:
                for word in sp(j):
                  doc.append(word.lemma_)  
            lemantizado.append(doc)
        return lemantizado
        
    def limpieza(self):
        self.comentarios=[self.remover_url(texto) for texto in self.comentarios]
        self.comentarios = [self.remover_caracteres(texto)for texto in self.comentarios]
        token=[self.tokenizar(i)for i in self.comentarios]
        stop=[self.remover_stop_words(i) for i in token]
        stem=self.stemming(stop)
        leman=self.lemantizar(stop)
        
        return token,stem, leman