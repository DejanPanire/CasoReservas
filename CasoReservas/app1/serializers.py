from rest_framework import serializers
from .models import *

class MesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesa
        fields = "__all__"

class ReservaSerializer(serializers.ModelSerializer):
    MesaDetalle = MesaSerializer(source="Nmesa", read_only=True)
    Mesa = serializers.PrimaryKeyRelatedField(
        queryset=Mesa.objects.all(), 
        source="Nmesa", 
        write_only=True, 
        required=False
    )

    class Meta:
        model = Reserva
        fields = [
            "id", 
            "nombrePersona", 
            "Telefono", 
            "FechaReserva", 
            "horaReserva", 
            "CantidadPersonas", 
            "Estado", 
            "Nmesa", 
            "Mesa", 
            "observacion", 
            "MesaDetalle"
        ]

    def validate(self, attrs):
        if "Nmesa" not in attrs and "Mesa" not in attrs:
            raise serializers.ValidationError({"Nmesa": "Este campo es requerido."})
        return attrs