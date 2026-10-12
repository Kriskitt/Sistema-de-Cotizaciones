"""Conexión SQL Server para AWS Lambda usando Microsoft ODBC Driver 18."""
from __future__ import annotations

import json
import os
from functools import lru_cache
from typing import Any

import boto3
import pyodbc


def _odbc_value(value: str) -> str:
    """Encierra un valor ODBC entre llaves y escapa las llaves de cierre."""
    return "{" + value.replace("}", "}}") + "}"


@lru_cache(maxsize=1)
def _read_secret() -> dict[str, Any]:
    """Lee y cachea el secreto de Secrets Manager durante la vida de la Lambda."""
    secret_arn = os.getenv("DB_SECRET_ARN")
    if not secret_arn:
        return {}

    region = os.getenv("AWS_REGION")
    client = boto3.client("secretsmanager", region_name=region)
    response = client.get_secret_value(SecretId=secret_arn)
    secret_string = response.get("SecretString")
    if not secret_string:
        raise RuntimeError("El secreto configurado no contiene SecretString.")
    secret = json.loads(secret_string)
    if not isinstance(secret, dict):
        raise RuntimeError("El secreto debe ser un objeto JSON.")
    return secret


def get_connection() -> pyodbc.Connection:
    """Abre una conexión segura a SQL Server. Nunca registrar la cadena de conexión."""
    secret = _read_secret()
    server = os.getenv("DB_SERVER") or secret.get("host") or secret.get("server")
    database = os.getenv("DB_NAME") or secret.get("dbname") or secret.get("database")
    port = os.getenv("DB_PORT") or str(secret.get("port") or 1433)
    username = os.getenv("DB_USER") or secret.get("username") or secret.get("user")
    password = os.getenv("DB_PASSWORD") or secret.get("password")

    missing = [
        label for label, value in (
            ("DB_SERVER", server), ("DB_NAME", database),
            ("DB_USER", username), ("DB_PASSWORD", password),
        ) if not value
    ]
    if missing:
        raise RuntimeError("Faltan variables de conexión: " + ", ".join(missing))

    connection_string = (
        "DRIVER={ODBC Driver 18 for SQL Server};"
        f"SERVER=tcp:{server},{port};"
        f"DATABASE={_odbc_value(str(database))};"
        f"UID={_odbc_value(str(username))};"
        f"PWD={_odbc_value(str(password))};"
        "Encrypt=yes;"
        "TrustServerCertificate=no;"
        "Connection Timeout=5;"
    )
    return pyodbc.connect(connection_string, timeout=5)
