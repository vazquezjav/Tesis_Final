from django.apps import AppConfig
from desarrollo.conexionBase import Conexion
from desarrollo.predecirSentimiento import Sentimiento

class ApiappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apiApp'

class CargarCosas(AppConfig):
    conexion = Conexion('127.16.26.27', 'root', 'LDA.2021_Javier', 'tesis',3306)
    modelo = Sentimiento('/home/lda/tesis_Javier-Vazquez/django/api/desarrollo/modeloSentimiento/MODELO_AMAZON.h5',
                         '/home/lda/tesis_Javier-Vazquez/django/api/desarrollo/modeloSentimiento/tokenizerRNN.pickle')
