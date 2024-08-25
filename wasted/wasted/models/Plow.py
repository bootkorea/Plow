from django.db import models

class Plow(models.Model):
    count = models.IntegerField(name='count',verbose_name='count')
