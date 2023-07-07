from django.shortcuts import render, HttpResponseRedirect
from django.contrib.auth import views, logout
from . import forms as forms


# Create your views here.
def register(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect("/")

    if request.method == "POST":
        form = forms.UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect("/auth/login")
    else:
        form = forms.UserCreationForm()
    return render(request, "auth/register.html", {"form": form})


def delete_account(request):
    args = {}

    if request.method == "POST":
        try:
            action = request.POST["action"]
        except:
            action = "error"

        match action:
            case "delete":
                request.user.delete()
                logout(request)
                args["message"] = "Account successfully deleteted."
            case "disable":
                request.user.is_active = False
                request.user.save()
                logout(request)
                args["message"] = "Account has been disabled."
            case _:
                args["message"] = "Somthing went wrong! Please try again."

    return render(request, "auth/delete_account.html", args)


class LoginView(views.LoginView):
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return HttpResponseRedirect("/")
        return super().dispatch(request, *args, **kwargs)


class PasswordResetView(views.PasswordResetView):
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return HttpResponseRedirect("/")
        return super().dispatch(request, *args, **kwargs)


class PasswordResetConfirmView(views.PasswordResetConfirmView):
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return HttpResponseRedirect("/")
        return super().dispatch(request, *args, **kwargs)


class PasswordResetDoneView(views.PasswordResetDoneView):
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return HttpResponseRedirect("/")
        return super().dispatch(request, *args, **kwargs)


class PasswordResetCompleteView(views.PasswordResetCompleteView):
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return HttpResponseRedirect("/")
        return super().dispatch(request, *args, **kwargs)
