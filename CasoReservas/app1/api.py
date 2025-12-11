from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .models import *
from .serializers import ReservaSerializer, MesaSerializer

class ReservaList(APIView):


    def get(self, request):
        reservas = Reserva.objects.all().order_by('FechaReserva', 'horaReserva')
        serializer = ReservaSerializer(reservas, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReservaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReservaDetalle(APIView):

    def get_object(self, pk):
        try:
            return Reserva.objects.get(pk=pk)
        except Reserva.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        reserva = self.get_object(pk)
        serializer = ReservaSerializer(reserva)
        return Response(serializer.data)

    def put(self, request, pk):
        reserva = self.get_object(pk)
        serializer = ReservaSerializer(reserva, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        reserva = self.get_object(pk)
        reserva.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MesaList(APIView):
    def get(self, request):
        mesas = Mesa.objects.all().order_by('numero')
        serializer = MesaSerializer(mesas, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MesaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MesaDetail(APIView):
    def get_object(self, pk):
        try:
            return Mesa.objects.get(pk=pk)
        except Mesa.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        mesa = self.get_object(pk)
        serializer = MesaSerializer(mesa)
        return Response(serializer.data)

    def put(self, request, pk):
        mesa = self.get_object(pk)
        serializer = MesaSerializer(mesa, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        mesa = self.get_object(pk)
        mesa.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)