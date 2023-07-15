from django.test import TestCase, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from base import models
from datetime import datetime
import shutil


# Create your tests here.
class Comp_SiLanguageKnown(TestCase):
    def test_object_create(self):
        models.Comp_SiLanguageKnown.objects.create(name="Test_HTML", skill=0)
        models.Comp_SiLanguageKnown.objects.create(name="Test_CSS", skill=50)
        models.Comp_SiLanguageKnown.objects.create(name="Test_JS", skill=100)


class StreamElement(TestCase):
    @override_settings(MEDIA_ROOT="media_test")
    def test_object_create(self):
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
    @override_settings(MEDIA_ROOT="media_test")
    def test_object_create(self):
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
    def test_object_create(self):
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
