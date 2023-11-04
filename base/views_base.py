from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.core.handlers.wsgi import WSGIRequest
from . import forms as forms
from . import models
from django.conf import settings


# Create your views here.
def comp_si(request):
    languages = models.Comp_SiLanguageKnown.objects.all().order_by("-skill")
    timeline = models.Comp_SiTimeLineElement.objects.all().order_by("date")

    args = {
        "languages": languages,
        "timeline": timeline,
    }

    return render(request, "base/comp_si.html", args)


def home(request):
    if request.method == "POST" and request.user.is_superuser:
        form = forms.AddStreamElementForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
    else:
        form = forms.AddStreamElementForm

    stream_elements = models.StreamElement.objects.order_by("-id").all()
    args = {"stream_elements": stream_elements[:3], "form": form}
    for stream_element in stream_elements[5:]:
        stream_element.delete()

    return render(request, "base/home.html", args)


def contact_form(request: WSGIRequest):
    if request.method == "POST":
        f = request.POST
        try:
            subject = f"{request.get_host()} [{f['email']}]"
            content = (
                f"\nFrom: {f['name']} [{f['email']}]"
                + f"\nSubject: {f['subject']}"
                + f"\n{'-'*100}"
                + f"\n{f['message']}"
            )

            send_mail(
                subject,
                content,
                settings.EMAIL_HOST_USER,
                [settings.EMAIL_HOST_USER],
                fail_silently=False,
            )
            m = 1
        except Exception:
            m = 2

        return redirect(f"{request.path}?success={m}")

    args = {"message": request.GET.get("success", 3)}

    return render(request, "base/contact_form.html", args)


@login_required()
def my_account(request):
    if request.method == "GET":
        form = forms.UserEditForm()
    elif request.method == "POST":
        form = forms.UserEditForm(request.POST)
        if form.is_valid():
            request.user.email = request.POST["email"]
            request.user.first_name = request.POST["first_name"]
            request.user.last_name = request.POST["last_name"]
            request.user.save()

    args = {
        "form": form,
    }
    return render(request, "base/my_account.html", args)


@login_required()
def delete_stream_element(request, element):
    if request.user.is_superuser:
        models.StreamElement.objects.get(id=element).delete()

    return redirect("/")


def artwork(request):
    args = {"imgs": models.Art.objects.all()[::-1]}
    return render(request, "base/artwork.html", args)


@login_required()
def artwork_delete(request, element):
    if request.user.is_superuser:
        models.Art.objects.get(id=element).delete()

    return redirect("/artwork")
