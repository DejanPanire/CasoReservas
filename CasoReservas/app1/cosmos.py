import uuid
from django.conf import settings
from azure.cosmos import CosmosClient, exceptions

class CosmosService:
    def __init__(self):

        self.client = CosmosClient(settings.COSMOS_DB_SETTINGS['URI'], credential=settings.COSMOS_DB_SETTINGS['KEY'])
        self.database = self.client.get_database_client(settings.COSMOS_DB_SETTINGS['DATABASE_NAME'])
        self.container = self.database.get_container_client(settings.COSMOS_DB_SETTINGS['CONTAINER_NAME'])

    def registrar_auditoria_json(self, usuario_rol, accion, datos_afectados):

        documento = {
            "id": str(uuid.uuid4()),  
            "usuario_rol": usuario_rol,  
            "accion": accion,           
            "detalles": datos_afectados,
            "origen_infraestructura": "AWS_EC2_Instance_Linux"
        }
        try:
            return self.container.create_item(body=documento)
        except exceptions.CosmosHttpResponseError as e:
            print(f"Error de conexión con el SDK de Azure Cosmos: {e}")
            return None

    def obtener_auditorias(self):

        try:
            query = "SELECT * FROM c ORDER BY c._ts DESC"
            return list(self.container.query_items(query=query, enable_cross_partition_query=True))
        except Exception:
            return []