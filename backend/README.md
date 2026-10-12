# Backend inicial — Sistema de Cotizaciones

Backend de referencia para integrarse en el repositorio Angular existente. El motor de datos esperado es **Microsoft SQL Server en Amazon RDS**.

## Arquitectura

`Angular -> API Gateway -> AWS Lambda (Python) -> servicio -> repositorio -> pyodbc / Microsoft ODBC Driver 18 -> SQL Server en RDS`

## Estructura

```text
backend/
├── src/
│   ├── lambda_function.py
│   ├── db/
│   │   └── connection.py
│   ├── repositories/
│   │   ├── health_repository.py
│   │   └── product_repository.py
│   └── services/
│       └── product_service.py
├── sql/
│   ├── 01_create_tables.sql
│   ├── 02_create_procedures.sql
│   └── 03_initial_data.sql
├── tests/
├── Dockerfile
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## Rutas del primer incremento

- `GET /health`: ejecuta `dbo.usp_HealthCheck` para validar el acceso a SQL Server.
- `GET /api/productos`: consulta el catálogo activo.
- `GET /api/productos?search=texto`: filtra por texto/SKU.
- `OPTIONS`: respuesta para solicitudes preflight CORS.

El manejador soporta eventos de API Gateway REST API v1 y HTTP API v2. Configura en API Gateway el proxy hacia la función Lambda.

## SQL

Ejecuta los scripts en SSMS, contra la base de datos creada para el proyecto y en este orden:

1. `sql/01_create_tables.sql`
2. `sql/02_create_procedures.sql`
3. `sql/03_initial_data.sql`

Verifica primero que la base sea la correcta y que no contenga objetos ajenos al proyecto. Los productos iniciales son demostrativos. El script no debe ejecutarse sobre `master`.

## Seguridad de configuración

- `.env.example` contiene únicamente valores ficticios de plantilla; no es un archivo de configuración real.
- El archivo real `.env` está excluido por `.gitignore`. No compartirlo, no subirlo a GitHub y no enviarlo por el chat del equipo.
- En AWS, utilizar `DB_SECRET_ARN` y AWS Secrets Manager para las credenciales de la base. El rol de ejecución de Lambda necesita permiso mínimo `secretsmanager:GetSecretValue` para el secreto concreto.
- No publicar claves AWS, `credentials`, contraseñas, tokens, archivos `.pem` ni cadenas de conexión reales.
- Si una credencial se publicó por error, quitar el archivo no la invalida: cambiar/rotar inmediatamente la credencial y revisar el historial del repositorio.
- No abrir el puerto 1433 de RDS a `0.0.0.0/0`. Permite únicamente el grupo de seguridad autorizado de Lambda o una fuente temporal controlada para pruebas.

## Configuración de la conexión

La función utiliza:

- `DB_SERVER`: endpoint DNS de RDS, sin `tcp:`.
- `DB_PORT`: normalmente `1433`.
- `DB_NAME`: base de datos del proyecto.
- `DB_SECRET_ARN`: ARN/nombre del secreto de Secrets Manager.
- `ALLOWED_ORIGIN`: origen del frontend, por ejemplo `http://localhost:4200` durante desarrollo.
- `AWS_REGION`: región donde reside el secreto.

El código conserva `DB_USER` y `DB_PASSWORD` como alternativa para pruebas locales, pero no guardes valores reales en archivos rastreados por Git. AWS recomienda Secrets Manager para credenciales de base de datos.

## Construcción de la imagen Lambda

Se utiliza una imagen de contenedor para instalar las dependencias nativas de `pyodbc` y Microsoft ODBC Driver 18. Requiere Docker:

```bash
docker build --platform linux/amd64 -t sistema-cotizaciones-backend .
```

Construye la imagen desde la carpeta `backend`. Para desplegarla, publica la imagen en Amazon ECR y crea/actualiza la función Lambda con arquitectura compatible `x86_64`. La construcción no crea recursos en AWS ni confirma conectividad con RDS.

## Pruebas unitarias

Con Python instalado:

```bash
python -m pip install -r requirements.txt
python -m unittest discover -s tests -v
```

Las pruebas de rutas simulan el acceso a la base de datos. No validan la red, credenciales, RDS ni el despliegue real.

## Estado y limitaciones

Este es un primer incremento para validar conectividad y catálogo. Todavía no implementa registro/login, emisión y verificación de tokens, autorización por rol, ni operaciones completas para crear, enviar, aprobar u observar cotizaciones. Esas rutas deben agregarse con validación del servidor, transacciones, controles de autorización y pruebas antes de considerarse listas.
