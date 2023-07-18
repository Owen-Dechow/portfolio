from django.urls import path
from . import views_base as views

urlpatterns = [
    # home
    path(
        "",
        views.home,
        name="home",
    ),
    # comp_si main
    path(
        "comp-si/",
        views.comp_si,
        name="comp-si",
    ),
    # accounts
    path(
        "account/",
        views.my_account,
        name="account",
    ),
    # conntact form
    path(
        "contact-form/",
        views.contact_form,
        name="contact-form",
    ),
    # delete stream element
    path(
        "delete-stream-element-<int:element>",
        views.delete_stream_element,
        name="delete-stream-element",
    ),
]
