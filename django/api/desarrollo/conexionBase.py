# -*- coding: utf-8 -*-
"""
Created on Wed May  5 11:32:24 2021

@author: vazqu
"""

import pymysql as mysql

class Conexion():
    
    def __init__(self, host, user, password,db, port):
        self.conexion=None
        self.host=host
        self.user=user
        self.password=password
        self.db=db
        self.port= port
        self.conectar()
         
    def conectar(self):
        self.conexion= mysql.connect(host=self.host, user=self.user, password=self.password, db=self.db)
        print("conexion django ", self.conexion)
        
    def guardar(self,query, datos,tipo):
        #.......Tipo .....
        # 0 .....solo un adato
        # 1 ...... una lista datos
        # 2 ..... consulta base 
        # 3 ...... actualizar base
        try:
            cursor = self.conexion.cursor()
            if tipo ==1:
                cursor.executemany(query,datos)
            if tipo ==0:
                cursor.execute(query,datos)
            if tipo ==2:
                cursor.execute(query)
            if tipo ==3:
                cursor.execute(query,datos)
            self.conexion.commit()
            
        except:
            # Si se genero algun error revertimos la operacion
            self.conexion.rollback()
            
        return  cursor