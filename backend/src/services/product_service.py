"""Casos de uso relacionados con el catálogo."""
from __future__ import annotations
from typing import Any

from repositories.product_repository import list_active_products as repository_list_active_products


def list_active_products(search: str | None = None) -> list[dict[str, Any]]:
    """Devuelve productos activos. La validación HTTP se realiza en Lambda."""
    return repository_list_active_products(search)
