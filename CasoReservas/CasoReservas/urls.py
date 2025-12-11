"""
URL configuration for CasoReservas project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app1.api import *
from app1.views import *

urlpatterns = [
    path('admin/', admin.site.urls), 
    path('', index, name="home"),
    path('ReservaApi/', ReservaList.as_view()),
    path('ReservaApi/<int:pk>', ReservaDetalle.as_view()),
    path('Reserva/', ListaReserva, name="listaReservas"),
    path('Reserva/AgregarReserva', AgregarReserva, name='AgregarReserva'),
    path('reservas/actualizar/<int:id>/', actuReserva, name='actuReserva'),
    path('reservas/eliminar/<int:id>/', DelReserva, name='DelReserva')
]
