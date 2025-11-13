-- Run this SQL file to update existing data to Russian
-- Execute: sudo docker exec -i isit_postgres psql -U isit -d isit < update_to_russian.sql

-- Update departments
UPDATE departments SET name = 'Головной офис' WHERE code = 'HQ';
UPDATE departments SET name = 'Информационные технологии' WHERE code = 'IT';
UPDATE departments SET name = 'Отдел кадров' WHERE code = 'HR';
UPDATE departments SET name = 'Финансы' WHERE code = 'FIN';
UPDATE departments SET name = 'Продажи' WHERE code = 'SALES';

-- Update categories
UPDATE categories SET name = 'Командировочные расходы' WHERE code = 'TRAVEL';
UPDATE categories SET name = 'Гостиничное размещение' WHERE code = 'TRAVEL_HOTEL';
UPDATE categories SET name = 'Транспорт' WHERE code = 'TRAVEL_TRANSPORT';
UPDATE categories SET name = 'Питание' WHERE code = 'TRAVEL_MEALS';
UPDATE categories SET name = 'Офисные расходы' WHERE code = 'OFFICE';
UPDATE categories SET name = 'Канцелярские товары' WHERE code = 'OFFICE_SUPPLIES';
UPDATE categories SET name = 'Оборудование' WHERE code = 'OFFICE_EQUIPMENT';
UPDATE categories SET name = 'Профессиональные услуги' WHERE code = 'SERVICES';
UPDATE categories SET name = 'Консалтинг' WHERE code = 'SERVICES_CONSULTING';
UPDATE categories SET name = 'Юридические услуги' WHERE code = 'SERVICES_LEGAL';
UPDATE categories SET name = 'Коммунальные услуги' WHERE code = 'UTILITIES';
UPDATE categories SET name = 'Электроэнергия' WHERE code = 'UTILITIES_ELECTRICITY';
UPDATE categories SET name = 'Интернет и связь' WHERE code = 'UTILITIES_INTERNET';

