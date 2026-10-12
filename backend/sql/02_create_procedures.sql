/*
  Sistema de Cotizaciones - Procedimientos iniciales para el primer hito del backend.
  Ejecutar en la base de datos destino después de 01_create_tables.sql.
*/
SET NOCOUNT ON;
GO

CREATE OR ALTER PROCEDURE dbo.usp_HealthCheck
AS
BEGIN
    SET NOCOUNT ON;
    SELECT CAST(1 AS INT) AS databaseOk, SYSUTCDATETIME() AS serverUtcTime;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Product_ListActive
    @Search NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NormalizedSearch NVARCHAR(100) = NULLIF(LTRIM(RTRIM(@Search)), N'');

    SELECT
        P.ProductId AS productId,
        P.SKU AS sku,
        P.Name AS name,
        P.Description AS description,
        CASE P.ProductType WHEN 'P' THEN 'PRODUCT' WHEN 'S' THEN 'SERVICE' END AS productType,
        P.UnitPrice AS unitPrice,
        P.IsStockManaged AS isStockManaged,
        P.StockQuantity AS stockQuantity
    FROM dbo.Products AS P
    WHERE P.IsActive = 1
      AND (
            @NormalizedSearch IS NULL
            OR P.Name LIKE N'%' + @NormalizedSearch + N'%'
            OR P.SKU LIKE N'%' + @NormalizedSearch + N'%'
            OR P.Description LIKE N'%' + @NormalizedSearch + N'%'
          )
    ORDER BY P.Name ASC;
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_Product_GetById
    @ProductId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.ProductId AS productId,
        P.SKU AS sku,
        P.Name AS name,
        P.Description AS description,
        CASE P.ProductType WHEN 'P' THEN 'PRODUCT' WHEN 'S' THEN 'SERVICE' END AS productType,
        P.UnitPrice AS unitPrice,
        P.IsStockManaged AS isStockManaged,
        P.StockQuantity AS stockQuantity
    FROM dbo.Products AS P
    WHERE P.ProductId = @ProductId
      AND P.IsActive = 1;
END;
GO
