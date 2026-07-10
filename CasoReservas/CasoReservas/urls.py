from django.contrib import admin
from django.urls import path
from app1.api import *
from app1.views import *

urlpatterns = [
    path('admin/', admin.site.urls), 
    path('', index, name="home"),
    path('ReservaApi/', ReservaList.as_view()),
    path('ReservaApi/<int:pk>/', ReservaDetalle.as_view()),
    path('Reserva/', ListaReserva, name="listaReservas"),
    path('Reserva/AgregarReserva/', AgregarReserva, name='AgregarReserva'),
    path('reservas/actualizar/<int:id>/', actuReserva, name='actuReserva'),
    path('reservas/eliminar/<int:id>/', DelReserva, name='DelReserva'),
    path('AuditoriaApi/', AuditoriaNoSQLList.as_view()),
    path('LoginApi/', LoginView.as_view()),
    path('UsuariosApi/', UsuarioList.as_view()),
    path('UsuariosApi/<int:pk>/', UsuarioList.as_view()),
    path('MesaApi/', MesaList.as_view()),
    path('MesaApi/<int:pk>/', MesaDetail.as_view()),
]