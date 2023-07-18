from django.test import TestCase, override_settings
from django import test
from django.core.files.uploadedfile import SimpleUploadedFile
from base import models
from datetime import datetime
import shutil


# Create your tests here.
class Comp_SiLanguageKnown(TestCase):
    def setUp(self):
        print("Testing model Comp_SiLanguageKnown")

    def test_object_create(self):
        print("Testing object creation")

        models.Comp_SiLanguageKnown.objects.create(name="Test_HTML", skill=0)
        models.Comp_SiLanguageKnown.objects.create(name="Test_CSS", skill=50)
        models.Comp_SiLanguageKnown.objects.create(name="Test_JS", skill=100)


class StreamElement(TestCase):
    def setUp(self):
        print("Testing model StreamElement")

    @override_settings(MEDIA_ROOT="media_test")
    def test_object_create(self):
        print("Testing object creation")

        models.StreamElement.objects.create(
            head="Test 1",
            link="https://github.com/Owen-Dechow",
            img=SimpleUploadedFile(
                name="test_image.jpg",
                content=open("media/test_img1.jpg", "rb").read(),
                content_type="image/jpeg",
            ),
        )

        models.StreamElement.objects.create(
            head="Test 2",
            img=SimpleUploadedFile(
                name="test_image.jpg",
                content=open("media/test_img2.png", "rb").read(),
                content_type="image/jpeg",
            ),
        )

    def tearDown(self):
        shutil.rmtree("media_test")


class Comp_SiTimeLineElement(TestCase):
    def setUp(self):
        print(f"Testing model Comp_SiTimeLineElement")

    @override_settings(MEDIA_ROOT="media_test")
    def test_object_create(self):
        print(f"Testing object creation")

        models.Comp_SiTimeLineElement.objects.create(
            event="Test",
            img=SimpleUploadedFile(
                name="test_image.jpg",
                content=open("media/test_img1.jpg", "rb").read(),
                content_type="image/jpeg",
            ),
        )

        models.Comp_SiTimeLineElement.objects.create(
            event="Test",
            img=SimpleUploadedFile(
                name="test_image.jpg",
                content=open("media/test_img2.png", "rb").read(),
                content_type="image/png",
            ),
            date=datetime(2023, 7, 11),
        )

    def tearDown(self):
        shutil.rmtree("media_test")


class Base_ColorPalette(TestCase):
    def setUp(self):
        print(f"Testing model Base_ColorPalette")

    def test_object_create(self):
        print(f"Testing object creation")

        models.Base_ColorPalette.objects.create(
            name="Default Test",
        )

        models.Base_ColorPalette.objects.create(
            name="All Black Test",
            background="black",
            prime="rgb(0, 0, 0)",
            d_prime="#000",
            dark_text="#000000",
            light_text="hsl(0, 0%, 0%)",
            title_tag="hwb(0 0% 100%)",
        )
