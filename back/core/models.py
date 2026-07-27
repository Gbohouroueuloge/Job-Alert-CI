from django.db import models

# Create your models here.
class Utilisateur(models.Model):
    STATUS_CHOICES = [
        ('actif', 'Actif'),
        ('desactif', 'Desactif')
    ]
    email = models.EmailField(unique=True)
    nom = models.CharField(max_length=100, blank=True, null=True)
    filier = models.CharField(max_length=300)
    date_inscription = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20 ,choices=STATUS_CHOICES, default='actif')
    def __str__(self):
        return self.email

class Offres(models.Model):
    titre = models.CharField(max_length=200)
    entreprise = models.CharField(max_length=100)
    lien = models.CharField()
    date_publication = models.DateField()
    source = models.CharField(max_length=100)
    filier_tag = models.CharField(max_length=50)
    has_unique = models.CharField(max_length=64 ,unique=True)
    date_extraction = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.titre} - {self.entreprise}"

class Envois(models.Model):
    STATUS_CHOICES = [
        ('succes', 'Succes'),
        ('echec', 'Echec')
    ]
    Utilisateur_id = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    date_envoi = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    nb_offres_envoyees = models.IntegerField()

    def __str__(self):
        return f"Envoi a {self.Utilisateur_id} - {self.date_envoi}"