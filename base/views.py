from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def homepage(request: HttpRequest) -> HttpResponse:
    return render(request, "base/homepage.html")
