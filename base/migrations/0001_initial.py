# Generated by Django 4.2 on 2023-06-22 17:08

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Base_ColorPalette",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=20)),
                ("background", models.CharField(default="#d3d3d3", max_length=25)),
                ("transparent", models.CharField(default="#00000090", max_length=25)),
                ("prime", models.CharField(default="#3e88ff", max_length=25)),
                ("secondary", models.CharField(default="#216fec", max_length=25)),
                ("prime_text", models.CharField(default="#eeeeee", max_length=25)),
                ("background_text", models.CharField(default="#404040", max_length=25)),
                ("title_tag", models.CharField(default="#980000", max_length=25)),
            ],
            options={
                "verbose_name": "Color palette",
            },
        ),
        migrations.CreateModel(
            name="Comp_SiLanguageKnown",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=20)),
                ("skill", models.FloatField()),
            ],
            options={
                "verbose_name": "Experience meater",
            },
        ),
        migrations.CreateModel(
            name="Comp_SiTimeLineElement",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("event", models.CharField(max_length=100)),
                ("img", models.ImageField(upload_to="timeline_images")),
                ("date", models.DateField(default=django.utils.timezone.now)),
            ],
            options={
                "verbose_name": "Computer-Science time line element",
            },
        ),
        migrations.CreateModel(
            name="StreamElement",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("head", models.CharField(max_length=500)),
                ("img", models.ImageField(upload_to="stream_images")),
                ("link", models.CharField(blank=True, max_length=500, null=True)),
            ],
            options={
                "verbose_name": "Stream announcement",
            },
        ),
    ]