from rest_framework import serializers

from django.db import models

class UserSerializer(serializers.Serializer):
    url = serializers.CharField(max_length=200)
    id_usuario = serializers.CharField(max_length=200)

    def create(self, validate_data):
        print("validate data ", validate_data)
        url2 = validate_data.get("url")
        id_usuario2 =  validate_data.get("id_usuario")
        print("url 2 ", url2, id_usuario2)
        return url2

class Book(models.Model):
    id=models.IntegerField(primary_key=True)
    title=models.CharField(max_length=200)
    author=models.CharField(max_length=200)

class Facebook(models.Model):
    id_facebook = models.CharField(max_length=200)
    url = models.CharField(max_length=800)
