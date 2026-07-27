from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from .models import Utilisateur, Offres, Envois
from .serializers import UtilisateurSerializer, OffresSerializer, EnvoisSerializer

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer

class OffresViewSet(viewsets.ModelViewSet):
    queryset = Offres.objects.all()
    serializer_class = OffresSerializer

class EnvoisViewSet(viewsets.ModelViewSet):
    queryset = Envois.objects.all()
    serializer_class = EnvoisSerializer