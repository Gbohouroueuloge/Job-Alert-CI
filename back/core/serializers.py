from rest_framework import serializers
from .models import Utilisateur, Offres, Envois

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = '__all__'

class OffresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offres
        fields = '__all__'

class EnvoisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Envois
        fields = '__all__'