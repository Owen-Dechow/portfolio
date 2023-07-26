from django.test import TestCase, Client, override_settings
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from base import models
from datetime import datetime
import shutil


# Create your tests here.
class TestComp_SiLanguageKnown(TestCase):
    def test_object_create(self):
        models.Comp_SiLanguageKnown.objects.create(name="Test_HTML", skill=0)
        models.Comp_SiLanguageKnown.objects.create(name="Test_CSS", skill=50)
        models.Comp_SiLanguageKnown.objects.create(name="Test_JS", skill=100)


class TestStreamElement(TestCase):
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


class TestComp_SiTimeLineElement(TestCase):
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


class TestBase_ColorPalette(TestCase):
    fixtures = ["colors"]

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

    def test_fixtures(self):
        self.assertGreater(models.Base_ColorPalette.objects.count(), 0)


class TestViews(TestCase):
    fixtures = ["colors"]

    @override_settings(MEDIA_ROOT="media_test")
    def setUp(self):
        self.client = Client()

        self.client_authenticated = Client()
        self.client_authenticated.login()

        self.test_stream_element = models.StreamElement.objects.create(
            head="Test 1",
            link="https://github.com/Owen-Dechow",
            img=SimpleUploadedFile(
                name="test_image.jpg",
                content=open("media/test_img1.jpg", "rb").read(),
                content_type="image/jpeg",
            ),
        )

    def test_comp_si(self):
        response = self.client.get(reverse("comp-si"))
        self.assertEquals(response.status_code, 200)
        self.assertTemplateUsed(response, "base/comp_si.html")

    def test_home(self):
        response = self.client.get(reverse("home"))
        self.assertEquals(response.status_code, 200)
        self.assertTemplateUsed(response, "base/home.html")

    def test_account(self):
        # Should redirect client to login page
        response = self.client_authenticated.get(reverse("account"))
        self.assertEquals(response.status_code, 302)
        self.assertTemplateNotUsed(response, "base/my_account")

    def test_contact_form(self):
        response = self.client.get(reverse("contact-form"))
        self.assertEquals(response.status_code, 200)
        self.assertTemplateUsed(response, "base/contact_form.html")

    def test_delete_stream_element(self):
        # Should redirect client to login page
        response = self.client.get(
            reverse("delete-stream-element", kwargs={"element": 1})
        )
        self.assertEquals(response.status_code, 302)
        self.assertTemplateNotUsed(response, "base/home.html")
        self.assertNotEquals(self.test_stream_element.id, 0)
