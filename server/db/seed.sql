-- Seed data matching the existing mock data

INSERT INTO laptops (brand, model, slug, cpu_brand, cpu_model, cpu_generation, cpu_full, cpu_cores, cpu_base_clock, cpu_boost_clock, ram, storage, screen_size, screen_resolution, gpu, os, price, original_price, purchase_cost, grade, battery_health, battery_cycles, physical_notes, refurb_actions, included_items, status, on_sale, discount_percent, flash_sale, featured, rating, review_count, in_stock, stock)
VALUES
('Dell', 'XPS 15 9560', 'dell-xps-15-9560', 'Intel', 'Core i7', '7th Gen', 'i7-7700HQ', 4, '2.8 GHz', '3.8 GHz', '16GB', '512GB SSD', '15.6"', '1920x1080', 'NVIDIA GeForce GTX 1050', 'Windows 11 Pro', 649, 1899, 420, 'Excellent', 87, 220, 'Minor shine on spacebar. Small scuff on right corner.', ARRAY['thermal_paste','fans_cleaned','fresh_os','ports_tested','keyboard_tested','screen_checked'], ARRAY['Laptop','Charger','Power cable'], 'Available', true, 15, true, true, 4.7, 24, true, 3),

('Lenovo', 'ThinkPad X1 Carbon Gen 9', 'lenovo-thinkpad-x1-carbon-gen-9', 'Intel', 'Core i5', '11th Gen', 'i5-1135G7', 4, '2.4 GHz', '4.2 GHz', '16GB', '256GB SSD', '14"', '1920x1200', 'Intel Iris Xe Graphics', 'Windows 11 Pro', 749, 1649, 500, 'Mint', 94, 98, '', ARRAY['fresh_os','ports_tested','keyboard_tested','screen_checked'], ARRAY['Laptop','Charger'], 'Available', true, 10, false, true, 4.9, 18, true, 2),

('HP', 'EliteBook 840 G8', 'hp-elitebook-840-g8', 'Intel', 'Core i7', '11th Gen', 'i7-1165G7', 4, '2.8 GHz', '4.7 GHz', '16GB', '512GB SSD', '14"', '1920x1080', 'Intel Iris Xe Graphics', 'Windows 11 Pro', 599, 1499, 380, 'Good', 78, 340, 'Keyboard has slight wear on left shift key.', ARRAY['fans_cleaned','fresh_os','ports_tested','keyboard_tested'], ARRAY['Laptop','Charger','Power cable'], 'Available', false, 0, false, true, 4.5, 31, true, 5),

('Apple', 'MacBook Pro 14" M1 Pro', 'macbook-pro-14-m1-pro', 'Apple', 'M1 Pro', 'N/A', 'Apple M1 Pro', 10, 'N/A', 'N/A', '16GB', '512GB SSD', '14.2"', '3024x1964', 'Apple 16-core GPU', 'macOS Sonoma', 1299, 1999, 900, 'Excellent', 91, 145, '', ARRAY['fresh_os','ports_tested','keyboard_tested','screen_checked'], ARRAY['Laptop','Charger (USB-C)','Power cable'], 'Available', false, 0, false, true, 4.8, 42, true, 1),

('Dell', 'Latitude 7420', 'dell-latitude-7420', 'Intel', 'Core i5', '11th Gen', 'i5-1145G7', 4, '2.6 GHz', '4.4 GHz', '8GB', '256GB SSD', '14"', '1920x1080', 'Intel Iris Xe Graphics', 'Windows 11 Pro', 449, 1199, 280, 'Good', 72, 410, 'Small dent on bottom cover.', ARRAY['fans_cleaned','fresh_os','ports_tested','keyboard_tested'], ARRAY['Laptop','Charger'], 'Available', true, 20, false, false, 4.3, 15, true, 7),

('Lenovo', 'ThinkPad T490', 'lenovo-thinkpad-t490', 'Intel', 'Core i5', '8th Gen', 'i5-8265U', 4, '1.6 GHz', '3.9 GHz', '8GB', '256GB SSD', '14"', '1920x1080', 'Intel UHD Graphics 620', 'Windows 11 Pro', 349, 999, 200, 'Good', 65, 520, 'Rubber feet missing on one corner.', ARRAY['fresh_os','ports_tested','keyboard_tested'], ARRAY['Laptop','Charger'], 'Available', false, 0, false, false, 4.1, 8, true, 4),

('HP', 'Pavilion 15', 'hp-pavilion-15', 'AMD', 'Ryzen 5', '5th Gen', 'Ryzen 5 5500U', 6, '2.1 GHz', '4.0 GHz', '8GB', '512GB SSD', '15.6"', '1920x1080', 'AMD Radeon Graphics', 'Windows 11 Home', 399, 849, 250, 'Excellent', 88, 180, '', ARRAY['thermal_paste','fans_cleaned','fresh_os','ports_tested','keyboard_tested','screen_checked'], ARRAY['Laptop','Charger','Power cable'], 'Available', true, 12, true, true, 4.6, 20, true, 6),

('Asus', 'ZenBook 14 UX425', 'asus-zenbook-14-ux425', 'Intel', 'Core i7', '10th Gen', 'i7-1065G7', 4, '1.3 GHz', '3.9 GHz', '16GB', '512GB SSD', '14"', '1920x1080', 'Intel Iris Plus Graphics', 'Windows 11 Pro', 549, 1299, 350, 'Excellent', 84, 260, 'Light wear on trackpad surface.', ARRAY['thermal_paste','fans_cleaned','fresh_os','ports_tested','keyboard_tested'], ARRAY['Laptop','Charger (USB-C)'], 'Available', false, 0, false, false, 4.4, 12, true, 2),

('Apple', 'MacBook Air M2', 'macbook-air-m2', 'Apple', 'M2', 'N/A', 'Apple M2', 8, 'N/A', 'N/A', '8GB', '256GB SSD', '13.6"', '2560x1664', 'Apple 8-core GPU', 'macOS Sonoma', 899, 1099, 650, 'Mint', 97, 45, '', ARRAY['fresh_os','ports_tested','keyboard_tested','screen_checked'], ARRAY['Laptop','Charger (USB-C)','Power cable'], 'Reserved', false, 0, false, false, 4.9, 6, false, 0),

('Dell', 'XPS 13 9310', 'dell-xps-13-9310', 'Intel', 'Core i7', '11th Gen', 'i7-1185G7', 4, '3.0 GHz', '4.8 GHz', '16GB', '512GB SSD', '13.4"', '1920x1200', 'Intel Iris Xe Graphics', 'Windows 11 Pro', 799, 1799, 550, 'Mint', 95, 65, '', ARRAY['thermal_paste','fans_cleaned','fresh_os','ports_tested','keyboard_tested','screen_checked'], ARRAY['Laptop','Charger (USB-C)','Power cable','Sleeve case'], 'Sold', false, 0, false, false, 4.8, 35, false, 0);

INSERT INTO reservations (customer_name, customer_phone, customer_email, laptop_id, laptop_name, laptop_slug, status)
VALUES
('John Smith', '+1 (555) 234-5678', 'john@example.com', 9, 'MacBook Air M2', 'macbook-air-m2', 'Pending'),
('Sarah Johnson', '+1 (555) 876-5432', 'sarah@example.com', 2, 'Lenovo ThinkPad X1 Carbon Gen 9', 'lenovo-thinkpad-x1-carbon-gen-9', 'Picked Up'),
('Mike Chen', '+1 (555) 345-6789', '', 1, 'Dell XPS 15 9560', 'dell-xps-15-9560', 'Expired');

INSERT INTO users (username, password_hash)
VALUES ('admin', '$2b$10$PLACEHOLDER');
