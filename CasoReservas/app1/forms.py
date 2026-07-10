from django import forms
from .models import *


class ReservaForm(forms.ModelForm):
    class Meta:
        model = Reserva
        fields = '__all__'
        widgets = {
            'FechaReserva': forms.DateInput(attrs={'type': 'date'}),
            'horaReserva': forms.TimeInput(attrs={'type': 'time'}),
        }