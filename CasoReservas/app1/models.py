from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

class Mesa(models.Model):
    numero= models.IntegerField(unique=True)
    capacidad= models.IntegerField()
    
    def __str__(self):
        return f"Mesa {self.numero} (capacidad {self.capacidad})"

    def reservasDisponibles(self):
        return self.sinreservar.filter(Estado= "SINRESERVAR")
    
class Reserva(models.Model):
    EstadoReserva= [("RESERVADO", "reservado"),
             ("SINRESERVAR", "sinreservar"), 
             ("COMPLETADAS", "completada"),
             ("CANCELADA", "cancelada"),("SINASISTENCIA", "sinasistencia")]
    
    nombrePersona = models.CharField(max_length=100)
    Telefono = models.CharField(max_length=20)
    FechaReserva  = models.DateField()
    horaReserva = models.TimeField()
    CantidadPersonas = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(15)])
    Estado = models.CharField(max_length=30, choices= EstadoReserva, default= "SINRESERVAR")
    Nmesa = models.ForeignKey(Mesa,on_delete=models.PROTECT, related_name="sinreservar")
    observacion = models.TextField(blank= True, null= True)

    def __str__(self):
         return f"Reserva {self.id} - {self.nombrePersona} ({self.FechaReserva} {self.horaReserva})"