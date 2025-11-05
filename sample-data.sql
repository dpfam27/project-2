-- Sample Data for ProjectII Database
-- Run this after importing database-schema.sql

USE projectii;

-- Insert test admin user (password: admin123, đã hash bcrypt)
INSERT INTO `users` (`username`, `password_hash`, `role`) VALUES
('testadmin', '$2b$10$8eQHxYQHqQ8nXQ8xJqP8.OuKqZ8nYyZ8nYyZ8nYyZ8nYyZ8nYyZ8m', 'admin'),
('testuser', '$2b$10$8eQHxYQHqQ8nXQ8xJqP8.OuKqZ8nYyZ8nYyZ8nYyZ8nYyZ8nYyZ8m', 'customer');

-- Insert sample customers
INSERT INTO `customers` (`name`, `email`, `phone`, `address`) VALUES
('Nguyen Van A', 'nguyenvana@example.com', '0909123456', '123 Le Loi, Q1, TPHCM'),
('Tran Thi B', 'tranthib@example.com', '0909234567', '456 Nguyen Hue, Q1, TPHCM'),
('Le Van C', 'levanc@example.com', '0909345678', '789 Dong Khoi, Q1, TPHCM');

-- Insert sample products
INSERT INTO `products` (`name`, `description`, `published`) VALUES
('Whey Protein', 'Premium whey protein supplement', 1),
('Whey Protein Gold Standard', 'Whey protein cao cấp từ Optimum Nutrition', 1),
('Mass Gainer', 'Sữa tăng cân nhanh chóng', 1),
('BCAA Energy', 'Amino acid phục hồi cơ bắp', 1),
('Pre-Workout', 'Năng lượng trước khi tập', 0);

-- Insert sample variants with price and stock
INSERT INTO `variants` (`productId`, `sku`, `attributes`, `price`, `stock`) VALUES
-- Whey Protein (ID 1)
(1, 'WP-CHOCO-1KG', JSON_OBJECT('size', '1kg', 'flavor', 'Chocolate'), 499000, 100),
(1, 'WP-VANILLA-1KG', JSON_OBJECT('size', '1kg', 'flavor', 'Vanilla'), 499000, 80),
(1, 'WP-CHOCO-2KG', JSON_OBJECT('size', '2kg', 'flavor', 'Chocolate'), 999000, 50),
-- Whey Gold Standard (ID 2)
(2, 'WP-GOLD-DCHOCO-2.27', JSON_OBJECT('size', '2.27kg', 'flavor', 'Double Chocolate'), 1699000, 30),
(2, 'WP-GOLD-VANILLA-2.27', JSON_OBJECT('size', '2.27kg', 'flavor', 'Vanilla Ice Cream'), 1699000, 25),
-- Mass Gainer (ID 3)
(3, 'MASS-CHOCO-3KG', JSON_OBJECT('size', '3kg', 'flavor', 'Chocolate'), 799000, 60),
(3, 'MASS-STRAW-3KG', JSON_OBJECT('size', '3kg', 'flavor', 'Strawberry'), 799000, 45),
-- BCAA (ID 4)
(4, 'BCAA-FRUIT-300G', JSON_OBJECT('size', '300g', 'flavor', 'Fruit Punch'), 449000, 120),
-- Pre-Workout (ID 5)
(5, 'PRE-BLUE-250G', JSON_OBJECT('size', '250g', 'flavor', 'Blue Raspberry'), 599000, 40);

-- Insert sample coupons
INSERT INTO `coupons` (`code`, `type`, `value`, `starts_at`, `ends_at`, `usage_limit`, `used_count`, `active`) VALUES
('WELCOME10', 'percent', 10.00, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 100, 0, 1),
('SAVE50K', 'fixed', 50000.00, '2025-01-01 00:00:00', '2025-06-30 23:59:59', 50, 0, 1),
('FLASH20', 'percent', 20.00, '2025-01-01 00:00:00', '2025-01-31 23:59:59', 200, 5, 1),
('NEWYEAR', 'percent', 15.00, '2025-01-01 00:00:00', '2025-01-15 23:59:59', 0, 10, 1),
('EXPIRED', 'percent', 30.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 10, 0, 0);

-- Insert sample orders
INSERT INTO `orders` (`customer_id`, `order_number`, `status`, `total_amount`, `created_at`) VALUES
(1, 'ORD-2025010001', 'Paid', 1698000, '2025-01-15 10:30:00'),
(1, 'ORD-2025010002', 'Shipped', 998000, '2025-01-20 14:45:00'),
(2, 'ORD-2025010003', 'Pending', 1498000, '2025-01-25 09:15:00'),
(3, 'ORD-2025010004', 'Paid', 798000, '2025-01-28 16:20:00');

-- Insert order items
INSERT INTO `order_items` (`order_id`, `variant_id`, `quantity`, `price`) VALUES
-- Order 1: 2x Whey Gold Standard + 1x BCAA
(1, 4, 1, 1699000),
(1, 8, 1, 449000),
-- Order 2: 2x Whey Protein Chocolate 1kg
(2, 1, 2, 499000),
-- Order 3: 1x Gold Standard + 1x Mass Gainer
(3, 5, 1, 1699000),
(3, 6, 1, 799000),
-- Order 4: 1x Mass Gainer
(4, 6, 1, 799000);

-- Insert payments
INSERT INTO `payments` (`order_id`, `provider`, `amount`, `status`, `provider_ref`) VALUES
(1, 'momo', 1698000, 'Success', 'MOMO-2025010001-ABC123'),
(2, 'vnpay', 998000, 'Success', 'VNPAY-2025010002-XYZ456'),
(3, 'momo', 1498000, 'Pending', NULL),
(4, 'vnpay', 798000, 'Success', 'VNPAY-2025010004-DEF789');

-- Verify data
SELECT 'Products Count:' as Info, COUNT(*) as Total FROM products;
SELECT 'Variants Count:' as Info, COUNT(*) as Total FROM variants;
SELECT 'Customers Count:' as Info, COUNT(*) as Total FROM customers;
SELECT 'Orders Count:' as Info, COUNT(*) as Total FROM orders;
SELECT 'Coupons Count:' as Info, COUNT(*) as Total FROM coupons;

-- Show sample product with variants
SELECT 
    p.name as product_name,
    v.sku as variant_sku,
    v.attributes,
    v.price,
    v.stock
FROM products p
LEFT JOIN variants v ON p.id = v.productId
WHERE p.published = 1
LIMIT 10;
