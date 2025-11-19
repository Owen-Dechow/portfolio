from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def editor(request: HttpRequest) -> HttpResponse:
    return render(request, "csp/editor.html")


def justify(request: HttpRequest) -> HttpResponse:
    return render(request, "csp/justify.html")
