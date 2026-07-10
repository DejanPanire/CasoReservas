from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from .forms import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .serializers import ReservaSerializer, MesaSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .cosmos import CosmosService

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
            catidad = form.cleaned_data["CantidadPersonas"]
            if catidad < 1 or catidad > 15:
                form.add_error("CantidadPersonas", 'El minimo de personas es 1 y el maximo es 15, vuelve a intentarlo por favor')
            else:
                form.save()
                return redirect('listaReservas')
    return render(request, 'agregarReserva.html', {"form": form})

def DelReserva(request, id):
    reserva = get_object_or_404(Reserva, id=id)
    reserva.delete()
    return redirect('listaReservas')

class ReservaList(APIView):
    def get(self, request):
        reservas = Reserva.objects.all().order_by('FechaReserva', 'horaReserva')
        serializer = ReservaSerializer(reservas, many=True)
        cosmos = CosmosService()
        cosmos.registrar_auditoria_json(
            usuario_rol="CLIENTE/ADMIN",
            accion="CONSULTAR_LISTA_RESERVAS",
            datos_afectados={"cantidad_renderizada": len(serializer.data)}
        )
        return Response(serializer.data)

    def post(self, request):
        serializer = ReservaSerializer(data=request.data)
        if serializer.is_valid():
            reserva_guardada = serializer.save()
            cosmos = CosmosService()
            cosmos.registrar_auditoria_json(
                usuario_rol="CLIENTE",
                accion="CREAR_RESERVA",
                datos_afectados={
                    "reserva_id": reserva_guardada.id,
                    "nombre": reserva_guardada.nombrePersona,
                    "personas": reserva_guardada.CantidadPersonas,
                    "fecha_operacion": str(reserva_guardada.FechaReserva)
                }
            )
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
            cosmos = CosmosService()
            cosmos.registrar_auditoria_json(
                usuario_rol="ADMINISTRADOR",
                accion="MODIFICAR_RESERVA",
                datos_afectados={"reserva_id": pk, "nuevo_estado": request.data.get('Estado')}
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        reserva = self.get_object(pk)
        nombre_afectado = reserva.nombrePersona
        reserva.delete()
        cosmos = CosmosService()
        cosmos.registrar_auditoria_json(
            usuario_rol="ADMINISTRADOR",
            accion="ELIMINAR_RESERVA",
            datos_afectados={"reserva_id": pk, "nombre_persona": nombre_afectado}
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

class AuditoriaNoSQLList(APIView):
    def get(self, request):
        cosmos = CosmosService()
        logs = cosmos.get_auditorias() if hasattr(cosmos, 'get_auditorias') else cosmos.obtener_auditorias()
        return Response(logs, status=status.HTTP_200_OK)

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
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        mesa = self.get_object(pk)
        try:
            mesa.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception:
            return Response(
                {"error": "No se puede eliminar la mesa porque tiene reservas asociadas."},
                status=status.HTTP_400_BAD_REQUEST
            )

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            cosmos = CosmosService()
            cosmos.registrar_auditoria_json(
                usuario_rol="ADMINISTRADOR" if user.is_staff else "CLIENTE",
                accion="INICIO_SESION",
                datos_afectados={"usuario": user.username, "es_staff": user.is_staff}
            )
            return Response({
                "token": token.key,
                "username": user.username,
                "is_staff": user.is_staff
            }, status=status.HTTP_200_OK)
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_400_BAD_REQUEST)

class UsuarioList(APIView):
    def get(self, request):
        usuarios = User.objects.all().values("id", "username", "email", "is_staff")
        return Response(usuarios, status=status.HTTP_200_OK)

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email", "")
        if not username or not password:
            return Response({"error": "Faltan datos obligatorios"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({"error": "El nombre de usuario ya existe"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password, email=email)
        cosmos = CosmosService()
        cosmos.registrar_auditoria_json(
            usuario_rol="CLIENTE",
            accion="REGISTRAR_NUEVO_USUARIO",
            datos_afectados={"usuario_creado": user.username}
        )
        return Response({"mensaje": "Usuario registrado con éxito", "id": user.id}, status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        is_staff = request.data.get("is_staff")
        if is_staff is not None:
            user.is_staff = is_staff
            user.save()
            cosmos = CosmosService()
            cosmos.registrar_auditoria_json(
                usuario_rol="ADMINISTRADOR",
                accion="MODIFICAR_ROL_USUARIO",
                datos_afectados={"usuario_afectado": user.username, "nuevo_rol_staff": is_staff}
            )
            return Response({"mensaje": "Rol actualizado con éxito"}, status=status.HTTP_200_OK)
        return Response({"error": "Datos inválidos"}, status=status.HTTP_400_BAD_REQUEST)