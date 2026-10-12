"""Manejador AWS Lambda para API Gateway (REST API v1 o HTTP API v2).

Rutas de esta primera entrega:
  GET /health          prueba una consulta contra SQL Server
  GET /api/productos   devuelve catálogo activo; acepta ?search=texto
"""
from __future__ import annotations

import json
import logging
import os
from datetime import date, datetime
from decimal import Decimal
from typing import Any
from urllib.parse import unquote

import pyodbc

from repositories.health_repository import check_database
from services.product_service import list_active_products

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class ApiError(Exception):
    def __init__(self, status_code: int, message: str) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.message = message


def _response(status_code: int, payload: dict[str, Any]) -> dict[str, Any]:
    origin = os.getenv("ALLOWED_ORIGIN", "http://localhost:4200")
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "GET,OPTIONS",
            "Vary": "Origin",
        },
        "body": json.dumps(payload, ensure_ascii=False, default=_json_default),
    }


def _json_default(value: Any) -> Any:
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    raise TypeError(f"Tipo no serializable: {type(value).__name__}")


def _method_and_path(event: dict[str, Any]) -> tuple[str, str]:
    # API Gateway HTTP API payload v2
    http_context = (event.get("requestContext") or {}).get("http") or {}
    method = http_context.get("method") or event.get("httpMethod") or "GET"
    path = event.get("rawPath") or event.get("path") or "/"
    return str(method).upper(), unquote(str(path)).rstrip("/") or "/"


def _query_params(event: dict[str, Any]) -> dict[str, str]:
    params = event.get("queryStringParameters") or {}
    return {str(key): str(value) for key, value in params.items() if value is not None}


def _db_health() -> dict[str, Any]:
    return check_database()


def _list_products(search: str | None) -> list[dict[str, Any]]:
    return list_active_products(search)


def handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    del context  # La primera versión no necesita datos del contexto Lambda.
    method, path = _method_and_path(event or {})

    if method == "OPTIONS":
        return _response(204, {})

    try:
        if method == "GET" and path in ("/health", "/api/health"):
            return _response(200, {"status": "ok", **_db_health()})

        if method == "GET" and path in ("/api/productos", "/productos"):
            search = _query_params(event or {}).get("search", "").strip() or None
            if search and len(search) > 100:
                raise ApiError(400, "El parámetro 'search' no puede superar 100 caracteres.")
            products = _list_products(search)
            return _response(200, {"data": products, "count": len(products)})

        raise ApiError(404, "Ruta no encontrada.")

    except ApiError as exc:
        return _response(exc.status_code, {"error": exc.message})
    except pyodbc.Error:
        logger.exception("Error de acceso a SQL Server")
        return _response(503, {"error": "La base de datos no está disponible. Revisa la conectividad y la configuración del backend."})
    except Exception:
        logger.exception("Error no controlado en la API")
        return _response(500, {"error": "Error interno del backend."})
