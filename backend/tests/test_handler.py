"""Pruebas unitarias básicas sin necesidad de una cuenta AWS ni base real."""
import json
import os
import sys
import unittest
import types
from unittest.mock import patch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

# Los tests de rutas no necesitan el driver nativo ODBC ni AWS SDK.
# Se simulan aquí solo para poder importar la Lambda en una máquina de pruebas ligera.
if "pyodbc" not in sys.modules:
    fake_pyodbc = types.ModuleType("pyodbc")
    fake_pyodbc.Error = type("OdbcError", (Exception,), {})
    fake_pyodbc.connect = lambda *args, **kwargs: None
    sys.modules["pyodbc"] = fake_pyodbc
if "boto3" not in sys.modules:
    fake_boto3 = types.ModuleType("boto3")
    fake_boto3.client = lambda *args, **kwargs: None
    sys.modules["boto3"] = fake_boto3

import lambda_function  # noqa: E402


class HandlerTests(unittest.TestCase):
    def _body(self, response):
        return json.loads(response["body"])

    def test_unknown_route_returns_404(self):
        response = lambda_function.handler(
            {"httpMethod": "GET", "path": "/no-existe"}, None
        )
        self.assertEqual(response["statusCode"], 404)
        self.assertEqual(self._body(response)["error"], "Ruta no encontrada.")

    def test_search_too_long_returns_400_without_db_call(self):
        with patch.object(lambda_function, "_list_products") as list_products:
            response = lambda_function.handler(
                {
                    "httpMethod": "GET",
                    "path": "/api/productos",
                    "queryStringParameters": {"search": "x" * 101},
                }, None
            )
        self.assertEqual(response["statusCode"], 400)
        list_products.assert_not_called()

    def test_products_route_returns_data(self):
        sample = [{"productId": 1, "sku": "SKU-1", "name": "Prueba", "unitPrice": 12.5}]
        with patch.object(lambda_function, "_list_products", return_value=sample):
            response = lambda_function.handler(
                {"httpMethod": "GET", "path": "/api/productos", "queryStringParameters": {}}, None
            )
        self.assertEqual(response["statusCode"], 200)
        self.assertEqual(self._body(response)["data"], sample)
        self.assertEqual(self._body(response)["count"], 1)


if __name__ == "__main__":
    unittest.main()
