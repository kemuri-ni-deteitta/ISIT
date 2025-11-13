-- Seed a small set of expenses to make analytics meaningful in development
-- Uses existing seeded departments, categories and the default admin user

WITH admin_user AS (
  SELECT id FROM users WHERE id = '00000000-0000-0000-0000-000000000001'
),
dep_it AS (
  SELECT id FROM departments WHERE code = 'IT'
),
dep_fin AS (
  SELECT id FROM departments WHERE code = 'FIN'
),
dep_hr AS (
  SELECT id FROM departments WHERE code = 'HR'
),
cat_hotel AS (
  SELECT id FROM categories WHERE code = 'TRAVEL_HOTEL'
),
cat_transport AS (
  SELECT id FROM categories WHERE code = 'TRAVEL_TRANSPORT'
),
cat_meals AS (
  SELECT id FROM categories WHERE code = 'TRAVEL_MEALS'
),
cat_supplies AS (
  SELECT id FROM categories WHERE code = 'OFFICE_SUPPLIES'
),
cat_equipment AS (
  SELECT id FROM categories WHERE code = 'OFFICE_EQUIPMENT'
),
cat_consulting AS (
  SELECT id FROM categories WHERE code = 'SERVICES_CONSULTING'
),
cat_legal AS (
  SELECT id FROM categories WHERE code = 'SERVICES_LEGAL'
),
cat_electricity AS (
  SELECT id FROM categories WHERE code = 'UTILITIES_ELECTRICITY'
),
cat_internet AS (
  SELECT id FROM categories WHERE code = 'UTILITIES_INTERNET'
)
INSERT INTO expenses (department_id, category_id, amount, currency, incurred_on, description, status, created_by, funding_source, performer)
SELECT (SELECT id FROM dep_fin), (SELECT id FROM cat_hotel), 12000.00, 'RUB', CURRENT_DATE - INTERVAL '14 days', 'Проживание в командировке', 'approved', (SELECT id FROM admin_user), 'internal', 'Иван'
UNION ALL
SELECT (SELECT id FROM dep_fin), (SELECT id FROM cat_transport), 4500.00, 'RUB', CURRENT_DATE - INTERVAL '13 days', 'Такси и железная дорога', 'approved', (SELECT id FROM admin_user), 'internal', 'Иван'
UNION ALL
SELECT (SELECT id FROM dep_fin), (SELECT id FROM cat_meals), 2200.00, 'RUB', CURRENT_DATE - INTERVAL '13 days', 'Питание в командировке', 'approved', (SELECT id FROM admin_user), 'internal', 'Иван'
UNION ALL
SELECT (SELECT id FROM dep_it), (SELECT id FROM cat_equipment), 100000.00, 'RUB', CURRENT_DATE - INTERVAL '20 days', 'Покупка ноутбуков', 'approved', (SELECT id FROM admin_user), 'internal', 'Пётр'
UNION ALL
SELECT (SELECT id FROM dep_it), (SELECT id FROM cat_internet), 3500.00, 'RUB', CURRENT_DATE - INTERVAL '5 days', 'Оплата интернета', 'paid', (SELECT id FROM admin_user), 'internal', 'Пётр'
UNION ALL
SELECT (SELECT id FROM dep_it), (SELECT id FROM cat_supplies), 1800.00, 'RUB', CURRENT_DATE - INTERVAL '3 days', 'Канцелярские товары', 'pending', (SELECT id FROM admin_user), 'internal', 'Пётр'
UNION ALL
SELECT (SELECT id FROM dep_hr), (SELECT id FROM cat_consulting), 75000.00, 'RUB', CURRENT_DATE - INTERVAL '28 days', 'Консультационные услуги по кадровым вопросам', 'approved', (SELECT id FROM admin_user), 'internal', 'Ольга'
UNION ALL
SELECT (SELECT id FROM dep_hr), (SELECT id FROM cat_legal), 18000.00, 'RUB', CURRENT_DATE - INTERVAL '7 days', 'Юридические услуги', 'approved', (SELECT id FROM admin_user), 'internal', 'Ольга'
UNION ALL
SELECT (SELECT id FROM dep_fin), (SELECT id FROM cat_electricity), 23000.00, 'RUB', CURRENT_DATE - INTERVAL '10 days', 'Электроэнергия офиса', 'paid', (SELECT id FROM admin_user), 'internal', 'Иван';


