from django import template
from django.contrib.auth.forms import AuthenticationForm

register = template.Library()


@register.simple_tag
def login_form():
    return AuthenticationForm()
