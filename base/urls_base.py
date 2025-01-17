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
    # my art
    path(
        "artwork",
        views.artwork,
        name="artwork",
    ),
    path(
        "artwork-delete/<int:element>",
        views.artwork_delete,
        name="delete-artwork",
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
    path(
        "web-sculpt", views.web_sculpt
    )
]
