from django.urls import path
from django.contrib.auth.views import (
    PasswordChangeView,
    PasswordChangeDoneView,
    LogoutView,
)
from . import views_auth as views

urlpatterns = [
    # login
    path(
        "login/",
        views.LoginView.as_view(template_name="auth/login.html"),
        name="login",
    ),
    # logout
    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),
    # password reset
    path(
        "password_reset/",
        views.PasswordResetView.as_view(template_name="auth/password_reset.html"),
        name="password_reset",
    ),
    # password reset confirm
    path(
        "password_reset_confirm/<uidb64>/<token>/",
        views.PasswordResetConfirmView.as_view(
            template_name="auth/password_reset_confirm.html",
        ),
        name="password_reset_confirm",
    ),
    # password reset done
    path(
        "password_reset_done/",
        views.PasswordResetDoneView.as_view(
            template_name="auth/password_reset_done.html"
        ),
        name="password_reset_done",
    ),
    # password reset complete
    path(
        "password_reset_complete/",
        views.PasswordResetCompleteView.as_view(
            template_name="auth/password_reset_complete.html"
        ),
        name="password_reset_complete",
    ),
    # password change
    path(
        "password_change/",
        PasswordChangeView.as_view(template_name="auth/password_change.html"),
        name="password_change",
    ),
    # password change done
    path(
        "password_change_done/",
        PasswordChangeDoneView.as_view(template_name="auth/password_change_done.html"),
        name="password_change_done",
    ),
    # delete account
    path(
        "delete_account/",
        views.delete_account,
        name="delete_account",
    ),
]
