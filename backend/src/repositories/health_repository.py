"""Consultas de disponibilidad contra SQL Server."""
from __future__ import annotations
from typing import Any

from db.connection import get_connection


def check_database() -> dict[str, Any]:
    connection = get_connection()
    try:
        cursor = connection.cursor()
        try:
            cursor.execute("EXEC dbo.usp_HealthCheck")
            row = cursor.fetchone()
            if row is None:
                raise RuntimeError("El procedimiento de salud no devolvió datos.")
            return {
                "database": "connected",
                "databaseOk": bool(row[0]),
                "serverUtcTime": row[1],
            }
        finally:
            cursor.close()
    finally:
        connection.close()
