from rest_framework import serializers
from .models import *

class MesaSerializer(serializers.ModelSerializer):
    class Meta:
        model= Mesa
        fields= "__all__"

class ReservaSerializer(serializers.ModelSerializer):
    MesaDetalle= MesaSerializer(source="Nmesa", read_only=True)

    class Meta:
        model= Reserva
        fields= ["id", "nombrePersona", "Telefono", "FechaReserva", "horaReserva", "CantidadPersonas", "Estado", "Nmesa", "observacion", "MesaDetalle"]