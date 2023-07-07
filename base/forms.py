from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
import django.forms as forms
from . import models


class UserCreationForm(UserCreationForm):
    first_name = forms.CharField(label="First Name")
    last_name = forms.CharField(label="Last Name")
    email = forms.EmailField(label="Email")

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "password1",
            "password2",
        )


class UserEditForm(forms.Form):
    first_name = forms.CharField(label="First Name")
    last_name = forms.CharField(label="Last Name")
    email = forms.EmailField(label="Email")

    class Meta:
        fields = (
            "email",
            "first_name",
            "last_name",
        )


class AddStreamElementForm(forms.ModelForm):
    class Meta:
        model = models.StreamElement
        fields = ("head", "link", "img")
