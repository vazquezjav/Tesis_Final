# -*- coding: utf-8 -*-
"""
Created on Wed Jun  9 16:14:34 2021

@author: vazqu
"""

import pandas as pd
import numpy as np
from numpy import array
import pickle
#from keras.models import load_model
#from keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

class Sentimiento():
    
    def __init__(self, nombreModelo, nombreTokenizer):
        self.model=self.cargarModelo(nombreModelo)
        self.tokenizer=self.cargarTokenizer(nombreTokenizer)
        
        
    def cargarModelo(self,nombreModelo):
         return load_model(nombreModelo)
     
    def cargarTokenizer(self, nombreTokenizer):
        with open(nombreTokenizer, 'rb') as handle:
             tokenizer = pickle.load(handle)
        return tokenizer
    
    def predecirSentimiento(self, text):
        num_Columnas=self.model.input_shape[1]
        text = self.tokenizer.texts_to_sequences(text)
        text = pad_sequences(text, maxlen=num_Columnas, dtype='int32', value=0)
        predict = self.model.predict(text,batch_size=1,verbose = 2)[0]
        sentiment=''
        print(predict)
        if np.argmax(predict) == 0 :
            sentiment='Negativo '
        if np.argmax(predict) == 1:
            sentiment='Positivo'
        return sentiment
