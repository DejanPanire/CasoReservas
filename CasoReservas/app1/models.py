from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

class Rol(models.TextChoices):
    ADMINISTRADOR = 'ADMIN', 'Administrador'
    CLIENTE = 'CLIENTE', 'Cliente'

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="perfil")
    rut = models.CharField(max_length=12, unique=True, null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    rol = models.CharField(max_length=20, choices=Rol.choices, default=Rol.CLIENTE)

    def __str__(self):
        return f"{self.user.username} - {self.rol}"

class Mesa(models.Model):
    numero = models.IntegerField(unique=True)
    capacidad = models.IntegerField()
    
    def __str__(self):
        return f"Mesa {self.numero} (capacidad {self.capacidad})"

    def reservasDisponibles(self):
        return self.sinreservar.filter(Estado="SINRESERVAR")
    
class Reserva(models.Model):
    EstadoReserva = [
        ("RESERVADO", "reservado"),
        ("SINRESERVAR", "sinreservar"), 
        ("COMPLETADAS", "completada"),
        ("CANCELADA", "cancelada"),
        ("SINASISTENCIA", "sinasistencia")
    ]
    
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reservas", null=True, blank=True)
    nombrePersona = models.CharField(max_length=100)
    Telefono = models.CharField(max_length=20)
    FechaReserva = models.DateField()
    horaReserva = models.TimeField()
    CantidadPersonas = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(15)])
    Estado = models.CharField(max_length=30, choices=EstadoReserva, default="SINRESERVAR")
    Nmesa = models.ForeignKey(Mesa, on_delete=models.PROTECT, related_name="sinreservar")
    observacion = models.TextField(blank=True, null=True)

    def __str__(self):
         return f"Reserva {self.id} - {self.nombrePersona} ({self.FechaReserva} {self.horaReserva})"