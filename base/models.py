from django.core.validators import FileExtensionValidator, ValidationError
from django.db import models
from datetime import datetime
from django.utils.timezone import now as datetime


# Create your models here.
class Comp_SiLanguageKnown(models.Model):
    name = models.CharField(max_length=20)
    skill = models.FloatField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Experience meater"


class StreamElement(models.Model):
    head = models.CharField(max_length=500)
    img = models.ImageField(upload_to="stream_images")
    link = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return self.head

    class Meta:
        verbose_name = "Stream announcement"


class Comp_SiTimeLineElement(models.Model):
    event = models.CharField(max_length=100)
    img = models.ImageField(upload_to="timeline_images")
    date = models.DateField(default=datetime)

    def __str__(self):
        return self.event

    class Meta:
        verbose_name = "Computer-Science time line element"


class Base_ColorPalette(models.Model):
    name = models.CharField(max_length=20)

    background = models.CharField(max_length=25, default="#d3d3d3")
    prime = models.CharField(max_length=25, default="#3e88ff")
    d_prime = models.CharField(max_length=25, default="#216fec")
    dark_text = models.CharField(max_length=25, default="#eeeeee")
    light_text = models.CharField(max_length=25, default="#404040")
    title_tag = models.CharField(max_length=25, default="#980000")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Color palette"
