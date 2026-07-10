from django.contrib import admin
from .models import *
# Register your models here.

class ReservaAdmin(admin.ModelAdmin):
    list_display = ["nombrePersona",
                    "Telefono",
                    "FechaReserva",
                    "horaReserva",
                    "CantidadPersonas",
                    "Estado",
                    "Nmesa",
                    "observacion"]
    
class Mesaadmin(admin.ModelAdmin):
    list_display = ["numero",
                    "capacidad"]
    

admin.site.register(Reserva, ReservaAdmin)
admin.site.register(Mesa, Mesaadmin)