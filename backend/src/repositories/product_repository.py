"""Consultas del catálogo de productos en SQL Server."""
from __future__ import annotations
from typing import Any

from db.connection import get_connection


def list_active_products(search: str | None = None) -> list[dict[str, Any]]:
    connection = get_connection()
    try:
        cursor = connection.cursor()
        try:
            cursor.execute("EXEC dbo.usp_Product_ListActive @Search = ?", search)
            columns = [column[0] for column in cursor.description or []]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]
        finally:
            cursor.close()
    finally:
        connection.close()
