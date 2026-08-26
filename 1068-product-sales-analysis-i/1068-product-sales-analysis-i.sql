# Write your MySQL query statement below
select Product.product_name,Sales.year,Sales.price from Product INNER join sales on Product.product_id=Sales.product_id