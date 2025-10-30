-- RDS MySQL Setup for Car Gallery AWS
-- Run this after creating RDS instance

USE car_expo;

-- Insert sample car types
INSERT INTO types (type, description) VALUES 
('SUV', 'Sport Utility Vehicles with high ground clearance and spacious interiors'),
('Sedan', 'Traditional four-door passenger cars with separate trunk compartments'),
('Hatchback', 'Compact cars with rear door that swings upward to provide access to cargo area'),
('Coupe', 'Two-door cars with fixed roof and sporty appearance');

-- Insert subtypes
INSERT INTO subtypes (type_id, name) VALUES 
-- SUV subtypes
(1, 'Compact SUV'),
(1, 'Mid-size SUV'),
(1, 'Full-size SUV'),
(1, 'Luxury SUV'),
-- Sedan subtypes
(2, 'Compact Sedan'),
(2, 'Mid-size Sedan'),
(2, 'Full-size Sedan'),
(2, 'Luxury Sedan'),
-- Hatchback subtypes
(3, 'Subcompact Hatchback'),
(3, 'Compact Hatchback'),
(3, 'Hot Hatch'),
-- Coupe subtypes
(4, 'Sports Coupe'),
(4, 'Luxury Coupe'),
(4, 'Grand Tourer');

-- Insert sample cars
INSERT INTO cars (name, type, subtype, short_desc, description, features, image_url) VALUES 
(
    'Toyota RAV4',
    'SUV',
    'Compact SUV',
    'Reliable and fuel-efficient compact SUV',
    'The Toyota RAV4 is a compact crossover SUV that offers excellent fuel economy, reliability, and all-weather capability. Perfect for families and adventure seekers alike.',
    '["All-Wheel Drive", "Safety Sense 2.0", "Apple CarPlay", "LED Headlights", "Roof Rails"]',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'
),
(
    'Honda Accord',
    'Sedan',
    'Mid-size Sedan',
    'Spacious and efficient mid-size sedan',
    'The Honda Accord delivers a perfect blend of performance, efficiency, and comfort. With its spacious interior and advanced safety features, it is an excellent choice for daily commuting.',
    '["Honda Sensing", "CVT Transmission", "Remote Start", "Dual-Zone Climate", "LED Lighting"]',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop'
),
(
    'Volkswagen Golf',
    'Hatchback',
    'Compact Hatchback',
    'European-engineered compact hatchback',
    'The Volkswagen Golf sets the standard for compact hatchbacks with its refined driving dynamics, premium interior, and German engineering excellence.',
    '["Digital Cockpit", "MQB Platform", "Car-Net", "IQ.DRIVE", "LED Taillights"]',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop'
),
(
    'BMW 4 Series',
    'Coupe',
    'Luxury Coupe',
    'Premium luxury coupe with dynamic performance',
    'The BMW 4 Series Coupe combines athletic performance with luxury comfort. Its distinctive design and advanced technology make every drive an experience to remember.',
    '["xDrive AWD", "iDrive 7.0", "M Sport Package", "Harman Kardon Audio", "Adaptive Suspension"]',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop'
),
(
    'Jeep Grand Cherokee',
    'SUV',
    'Mid-size SUV',
    'Capable mid-size SUV with off-road prowess',
    'The Jeep Grand Cherokee offers legendary off-road capability combined with on-road refinement. Perfect for those who demand both luxury and adventure capability.',
    '["4x4 Capability", "Uconnect System", "Selec-Terrain", "Premium Audio", "Panoramic Sunroof"]',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop'
),
(
    'Mercedes-Benz S-Class',
    'Sedan',
    'Luxury Sedan',
    'Ultimate luxury sedan with cutting-edge technology',
    'The Mercedes-Benz S-Class represents the pinnacle of luxury sedans, offering unparalleled comfort, advanced technology, and prestigious styling.',
    '["MBUX System", "Air Suspension", "Burmester Audio", "Massage Seats", "Night Vision"]',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop'
);

-- Create indexes for better performance
CREATE INDEX idx_cars_type ON cars(type);
CREATE INDEX idx_cars_subtype ON cars(subtype);
CREATE INDEX idx_cars_type_subtype ON cars(type, subtype);

-- Verify data
SELECT 'Types Count:' as Info, COUNT(*) as Count FROM types
UNION ALL
SELECT 'Subtypes Count:', COUNT(*) FROM subtypes
UNION ALL
SELECT 'Cars Count:', COUNT(*) FROM cars;