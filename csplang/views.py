from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def editor(request: HttpRequest) -> HttpResponse:
    return render(request, "csplang/editor.html")


def justify(request: HttpRequest) -> HttpResponse:
    return render(request, "csplang/justify.html")
