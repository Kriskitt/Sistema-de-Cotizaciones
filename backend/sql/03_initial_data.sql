/*
  Datos iniciales de demostración para Sistema de Cotizaciones.
  No incluye usuarios ni contraseñas de ejemplo: las cuentas se crearán mediante el backend seguro.
  Los importes son demostrativos y deben reemplazarse por los del negocio.
*/
SET NOCOUNT ON;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE Code = 'ADMIN')
    INSERT INTO dbo.Roles (Code, Name) VALUES ('ADMIN', N'Administrador');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE Code = 'SELLER')
    INSERT INTO dbo.Roles (Code, Name) VALUES ('SELLER', N'Vendedor');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE Code = 'CUSTOMER')
    INSERT INTO dbo.Roles (Code, Name) VALUES ('CUSTOMER', N'Cliente');
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE SKU = N'SW-LIC-001')
    INSERT INTO dbo.Products (SKU, Name, Description, ProductType, UnitPrice, IsStockManaged, StockQuantity)
    VALUES (N'SW-LIC-001', N'Licencia de software empresarial', N'Licencia de software para uso empresarial. Precio demostrativo.', 'S', 450.00, 0, NULL);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE SKU = N'DEV-HR-001')
    INSERT INTO dbo.Products (SKU, Name, Description, ProductType, UnitPrice, IsStockManaged, StockQuantity)
    VALUES (N'DEV-HR-001', N'Desarrollo de software a medida', N'Servicio de desarrollo por hora. Precio demostrativo.', 'S', 120.00, 0, NULL);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE SKU = N'SUP-HR-001')
    INSERT INTO dbo.Products (SKU, Name, Description, ProductType, UnitPrice, IsStockManaged, StockQuantity)
    VALUES (N'SUP-HR-001', N'Soporte técnico especializado', N'Servicio de soporte por hora. Precio demostrativo.', 'S', 95.00, 0, NULL);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE SKU = N'ROUTER-001')
    INSERT INTO dbo.Products (SKU, Name, Description, ProductType, UnitPrice, IsStockManaged, StockQuantity)
    VALUES (N'ROUTER-001', N'Equipo de red empresarial', N'Equipo de red de ejemplo para cotización; stock demostrativo.', 'P', 680.00, 1, 10);
GO

SELECT Code, Name, IsActive FROM dbo.Roles ORDER BY RoleId;
SELECT ProductId, SKU, Name, ProductType, UnitPrice, IsActive FROM dbo.Products ORDER BY ProductId;
GO
