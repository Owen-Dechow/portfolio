# Generated by Django 4.2 on 2023-06-22 17:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0002_rename_secondary_base_colorpalette_d_prime"),
    ]

    operations = [
        migrations.RenameField(
            model_name="base_colorpalette",
            old_name="prime_text",
            new_name="dark_text",
        ),
    ]