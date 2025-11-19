from django.urls import path
from . import views

urlpatterns = [
    path("", views.editor),
    path("justify", views.justify),
]
