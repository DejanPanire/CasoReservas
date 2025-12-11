from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from .forms import *


def index(request):
    return render(request, 'index.html')

def ListaReserva(request):
    reservas = Reserva.objects.all().order_by('FechaReserva', 'horaReserva')
    data = {'reservas': reservas}
    return render(request, 'listaReservas.html', data)


def AgregarReserva(request):
    form = ReservaForm()

    if request.method == 'POST':
        form = ReservaForm(request.POST)

        if form.is_valid():


            cantidad = form.cleaned_data["CantidadPersonas"]
            if cantidad < 1 or cantidad > 15:
                form.add_error("CantidadPersonas", 'El minimo de personas es 1 y el maximo es 15, vuelve a intentarlo por favor')
            else:
                form.save()
                return redirect('listaReservas')

    return render(request, 'agregarReserva.html', {"form": form})

def actuReserva(request, id):
    reserva = Reserva.objects.get(id=id)
    form = ReservaForm(instance=reserva)

    if request.method == 'POST':
        form = ReservaForm(request.POST, instance=reserva)

        if form.is_valid():

            cantidad = form.cleaned_data["CantidadPersonas"]
            if cantidad < 1 or cantidad > 15:
                form.add_error("CantidadPersonas", 'El minimo de personas es 1 y el maximo es 15, vuelve a intentarlo por favor')
            else:
                form.save()
                return redirect('listaReservas')

    return render(request, 'agregarReserva.html', {"form": form})


def DelReserva(request, id):
    reserva = get_object_or_404(Reserva, id=id)
    reserva.delete()
    return redirect('listaReservas')