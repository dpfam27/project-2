-- Sample Data for ProjectII Database
-- Run this after importing database-schema.sql

USE projectii;

-- Insert test admin user (password: admin123, đã hash bcrypt)
INSERT INTO `users` (`username`, `password`, `role`) VALUES
('testadmin', '$2b$10$8eQHxYQHqQ8nXQ8xJqP8.OuKqZ8nYyZ8nYyZ8nYyZ8nYyZ8nYyZ8m', 'admin'),
('testuser', '$2b$10$8eQHxYQHqQ8nXQ8xJqP8.OuKqZ8nYyZ8nYyZ8nYyZ8nYyZ8nYyZ8m', 'user');

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

-- Insert sample variants (size/flavor combinations)
INSERT INTO `variants` (`product_id`, `name`, `sku`) VALUES
-- Whey Protein (ID 1)
(1, 'Whey Protein - Chocolate 1kg', 'WP-CHOCO-1KG'),
(1, 'Whey Protein - Vanilla 1kg', 'WP-VANILLA-1KG'),
(1, 'Whey Protein - Chocolate 2kg', 'WP-CHOCO-2KG'),
-- Whey Gold Standard (ID 2)
(2, 'Gold Standard - Double Chocolate 2.27kg', 'WP-GOLD-DCHOCO-2.27'),
(2, 'Gold Standard - Vanilla Ice Cream 2.27kg', 'WP-GOLD-VANILLA-2.27'),
-- Mass Gainer (ID 3)
(3, 'Mass Gainer - Chocolate 3kg', 'MASS-CHOCO-3KG'),
(3, 'Mass Gainer - Strawberry 3kg', 'MASS-STRAW-3KG'),
-- BCAA (ID 4)
(4, 'BCAA Energy - Fruit Punch 300g', 'BCAA-FRUIT-300G'),
-- Pre-Workout (ID 5)
(5, 'Pre-Workout - Blue Raspberry 250g', 'PRE-BLUE-250G');

-- Insert prices for variants
INSERT INTO `prices` (`variant_id`, `base_price`, `sale_price`, `currency`) VALUES
-- Whey Protein
(1, 599000, 499000, 'VND'),
(2, 599000, 499000, 'VND'),
(3, 1099000, 999000, 'VND'),
-- Whey Gold Standard
(4, 1899000, 1699000, 'VND'),
(5, 1899000, 1699000, 'VND'),
-- Mass Gainer
(6, 899000, 799000, 'VND'),
(7, 899000, 799000, 'VND'),
-- BCAA
(8, 499000, 449000, 'VND'),
-- Pre-Workout
(9, 699000, 599000, 'VND');

-- Insert stock quantities
INSERT INTO `stocks` (`variant_id`, `quantity`, `reserved`) VALUES
(1, 100, 0),
(2, 80, 0),
(3, 50, 0),
(4, 30, 0),
(5, 25, 0),
(6, 60, 0),
(7, 45, 0),
(8, 120, 0),
(9, 40, 0);

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
    v.name as variant_name,
    pr.base_price,
    pr.sale_price,
    s.quantity as stock
FROM products p
LEFT JOIN variants v ON p.id = v.product_id
LEFT JOIN prices pr ON v.id = pr.variant_id
LEFT JOIN stocks s ON v.id = s.variant_id
WHERE p.published = 1
LIMIT 10;
