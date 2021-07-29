# -*- coding: utf-8 -*-
"""
Created on Fri May 14 15:32:17 2021

@author: vazqu
"""

from gensim import corpora, models
import gensim
from pprint import pprint

import pyLDAvis.gensim_models
import pickle
import pyLDAvis
import os

from matplotlib import pyplot as plt
from wordcloud import WordCloud, STOPWORDS
import matplotlib.colors as mcolors
import pandas as pd
import numpy as np
import random
from gensim.models.coherencemodel import CoherenceModel

from sklearn.manifold import TSNE
from bokeh.plotting import figure, show, save
from bokeh.plotting import  output_file as out_boken
from bokeh.models import ColumnDataSource, HoverTool
from bokeh.palettes import all_palettes

#import warnings
#warnings.filterwarnings("ignore", category=DeprecationWarning)

class ModeloLDA():
    
    def __init__(self, lemantizado, comentarios):
        #print(1)
        self.diccionario_LDA=corpora.Dictionary(lemantizado)
        self.corpus = [self.diccionario_LDA.doc2bow(text) for text in lemantizado]
        self.lda_model=gensim.models.LdaModel
        self.lemantizado = lemantizado
        self.comentarios = comentarios
        self.comentariosTopicos = None
        self.path = '/var/www/html/siast/'
        self.path_url = 'https://cloudcomputing.ups.edu.ec/api-apache-siast/'
	

    def modelo(self, topics, id_publicacion):
        
        self.lda_model = gensim.models.LdaModel(corpus=self.corpus, 
                                                id2word=self.diccionario_LDA, 
                                                num_topics=topics,
                                                per_word_topics=True, 
                                                passes=30,
                                                chunksize=5,
                                                iterations = 250,
                                                eta = 'auto',
                                                random_state=42
                                                #alpha=[0.01]*topics,
                                                #eta=[0.01]*len(self.diccionario_LDA.keys())
                                                )
        #pprint(self.lda_model.print_topics())
        
        path_topics = self.graficarTopicos(topics, id_publicacion)
        
        path_pyldavis = self.guardar(id_publicacion)
        self.comentariosTopicos = self.formato_topico_oracion()

        path_tsne = self.graficarTSNE(topics,id_publicacion)

        return path_topics, path_pyldavis,path_tsne, self.comentariosTopicos['topico']
        
    def graficar(self, num_topics, lda_model):
        pyLDAvis.enable_notebook()
        LDAvis_data_filepath = os.path.join('./ldavis_prepared_'+str(num_topics))
        if 1 == 1:
            LDAvis_prepared = pyLDAvis.gensim_models.prepare(lda_model, self.corpus, self.diccionario_LDA)
            with open(LDAvis_data_filepath, 'wb') as f:
                pickle.dump(LDAvis_prepared, f)
        # load the pre-prepared pyLDAvis data from disk
        with open(LDAvis_data_filepath, 'rb') as f:
            LDAvis_prepared = pickle.load(f)
        pyLDAvis.save_html(LDAvis_prepared, './ldavis_prepared_' + str(num_topics) + '.html')
        LDAvis_prepared

    def guardar(self, id_publicacion):
        vis = pyLDAvis.gensim_models.prepare(topic_model=self.lda_model, corpus=self.corpus, dictionary=self.diccionario_LDA)
        path = 'pyLDAvis/lda_' + str(id_publicacion) + '.html'
        path_url=self.path_url+path
        path=self.path+path
        pyLDAvis.save_html(vis, path)
        return path_url

    def graficarTopicos(self, num_topics, id_publicacion):
        cols = [color for name, color in  mcolors.XKCD_COLORS.items()]
        cloud = WordCloud(stopwords=self.lemantizado,
                  background_color='white',
                  width=500,
                  height=400,
                  max_words=10,
                  colormap='tab10',
                  color_func=lambda *args, **kwargs: cols[random.randint(0, 500)],
                  prefer_horizontal=1.0)

        topics = self.lda_model.show_topics(formatted=False)

        fig, axes = plt.subplots(1, num_topics, figsize=(15,15), sharex=True, sharey=True)
        for i, ax in enumerate(axes.flatten()):
            fig.add_subplot(ax)
            topic_word = dict(topics[i][1]) #convertir diccionario las palabras claves
            cloud.generate_from_frequencies(topic_word, max_font_size=300)
            plt.gca().imshow(cloud)
            plt.gca().set_title('Topico ' + str(i+1), fontdict=dict(size=16))
            plt.gca().axis('off')

        plt.subplots_adjust(wspace=0, hspace=0)
        plt.axis('off')
        plt.margins(x=0, y=0)
        plt.tight_layout()
        fig.patch.set_facecolor('xkcd:white')

        if num_topics > 4 and num_topics <= 6:
            fig.set_figwidth(14)
            fig.set_figheight(3)
        elif num_topics <= 4:
            fig.set_figwidth(12)
            fig.set_figheight(4)
        elif num_topics >= 7 and num_topics <= 10:
            fig.set_figwidth(16)
            fig.set_figheight(3)
        elif num_topics >= 10 and num_topics <= 15:
            fig.set_figwidth(18)
            fig.set_figheight(4)

        path ='imagenTopics/topics_' + str(num_topics) + '_' + str(id_publicacion) + '.png'
        path_url=self.path_url+path
        path=self.path+path
        fig.savefig(path)
        #plt.show()
        return path_url

    def formato_topico_oracion(self):
        topics_df = pd.DataFrame()

        for i, row_list in enumerate(self.lda_model[self.corpus]):
            row = row_list[0] if self.lda_model.per_word_topics else row_list
            row = sorted(row, key=lambda x: (x[1]), reverse=True)
            for j, (topic_num, prop_topic) in enumerate(row):
                if j == 0:
                    wp = self.lda_model.show_topic(topic_num)
                    topic_keywords = ", ".join([word for word, prop in wp])
                    d = int(topic_num)
                    topics_df = topics_df.append(
                        pd.Series([int(format(d, '.0f')), round((prop_topic * 100), 2), topic_keywords]),
                        ignore_index=True)
                else:
                    break

        contents = pd.Series(self.comentarios)
        topics_df = pd.concat([topics_df, contents], axis=1)
        topics_df.columns = ['topico', 'coherencia', 'palabras claves', 'comentario']
        return topics_df

    def graficarTSNE(self, num_topics, id_publicacion):

        # obtener copia del dataframe de los topicos con las oraciones
        topics_coments = self.comentariosTopicos
        leman = self.lemantizado
        # obtener los pesos de los Topicos
        topic_weights = []
        for i, row_list in enumerate(self.lda_model[self.corpus]):
            topic_weights.append([w for i, w in row_list[0]])

        # array de los pesos de los Topicos
        arr = pd.DataFrame(topic_weights).fillna(0).values

        # mantener los puntos separados
        # arr = arr[np.amax(arr, axis=1) > 0.35]

        # topico dominante en cada documento
        topic_num = np.argmax(arr, axis=1)
        #tsne_model = TSNE(n_components=2, verbose=1, random_state=42, angle=.99, init='pca')

        # condicionales, comprobar tamanio lemantizado para el numero de iteraciones, depende mucho de la cantidad de comentarios
        if len(leman) <= 35:
            tsne_model = TSNE(n_components=2, verbose=2, random_state=2050, perplexity=30, early_exaggeration=120,
                              n_iter=280, angle=.99, init='pca')
        elif len(leman) > 35 and len(leman) <= 60:
            tsne_model = TSNE(n_components=2, verbose=2, random_state=2050, perplexity=30, early_exaggeration=120,
                              n_iter=400, angle=.99, init='pca')
        elif len(leman) > 60 and len(leman) <= 120:
            tsne_model = TSNE(n_components=2, verbose=2, random_state=2050, perplexity=30, early_exaggeration=120,
                              n_iter=550, angle=.99, init='pca')
        elif len(leman) > 120:
            tsne_model = TSNE(n_components=2, verbose=2, random_state=2050, perplexity=30, early_exaggeration=120,
                              n_iter=800, angle=.99, init='pca')
        tsne_lda = tsne_model.fit_transform(arr)

        topics_coments['x'] = tsne_lda[:, 0]
        topics_coments['y'] = tsne_lda[:, 1]

        cluster_colors = {0: 'blue', 1: 'green', 2: 'yellow', 3: 'red', 4: 'skyblue', 5: 'salmon', 6: 'orange',
                          7: 'maroon', 8: 'crimson', 9: 'black', 10: 'gray', 11: 'coral', 12: 'cyan', 13: 'violet',
                          14: 'orange'}
        topics_coments['colors'] = topics_coments['topico'].apply(lambda l: cluster_colors[l])
        top_labels = {0: 'Topico 1', 1: 'Topico 2', 2: 'Topico 3', 3: 'Topico 4', 4: 'Topico 5', 5: 'Topico 6',
                      6: 'Topico 7', 7: 'Topico 8', 8: 'Topico 9', 9: 'Topico 10', 10: 'Topico 11', 11: 'Topico 12',
                      12: 'Topico 13', 13: 'Topico 14', 14: 'Topico 15'}
        #topics_coments['topico'] = [i+1 for i in topics_coments['topico']]
        topics_coments['topico'] = topics_coments['topico'].astype(np.int64)

        if num_topics ==2: # condicional, problema con la paleta de colores
            num_topics+=1
        source = ColumnDataSource(data=dict(
            x=topics_coments.x,
            y=topics_coments.y,
            colors=[all_palettes['Set1'][num_topics][i] for i in topics_coments.topico],
            title=topics_coments.comentario,
            alpha=[0.9] * topics_coments.shape[0],
            size=[7] * topics_coments.shape[0]
        ))
        source = ColumnDataSource(dict(
            x=topics_coments['x'],
            y=topics_coments['y'],
            color=topics_coments['colors'],
            label=topics_coments['topico'].apply(lambda l: top_labels[l]),
            # topic_key = embedding['hue'],
            content=topics_coments['comentario']
        ))

        title = 'Grafico Iteractivo'
        plot_lda = figure(plot_width=1000, plot_height=600,
                          title=title, tools="pan,wheel_zoom,box_zoom,reset,hover",
                          x_axis_type=None, y_axis_type=None, min_border=1
                          )
        plot_lda.scatter(x='x', y='y', legend='label', source=source,
                         color='color', alpha=0.8, size=10)

        hover = plot_lda.select(dict(type=HoverTool))
        hover.tooltips = {"Comentario": "@content", "Topico": "@label"}
        plot_lda.legend.location = 'top_left'
        path = 'TSNE_iteractivo/tsne_' + str(id_publicacion) + '.html'

        path_url = self.path_url + path
        path = self.path+path
        #show(plot_lda)
        out_boken(path)
        save(plot_lda)
        return path_url
                  
                   
