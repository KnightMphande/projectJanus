-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    names VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR DEFAULT 'customer' NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Drivers license table
CREATE TABLE drivers_license (
    id SERIAL PRIMARY KEY,              
    customer_id INT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,            
    license_number VARCHAR(50) UNIQUE NOT NULL, 
    issue_date DATE NOT NULL,            
    expiry_date DATE NOT NULL,                
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Staff table
CREATE TABLE IF NOT EXISTS staff (
    staff_id SERIAL PRIMARY KEY,
    names VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    must_change_password BOOLEAN DEFAULT TRUE,
    role VARCHAR DEFAULT 'admin' NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- INSERT staff
INSERT INTO staff (names, phone, email, password, role) VALUES
    ('John Skales', '0724569867', 'admin@email.com', 'admin', 'admin');


-- Locations
CREATE TABLE IF NOT EXISTS locations (
    location_id SERIAL PRIMARY KEY,
    location VARCHAR(250) UNIQUE NOT NULL, 
    address VARCHAR(255) UNIQUE NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO locations (location, address)
VALUES
('Johannesburg, Gauteng', 'Sandton City Mall, 83 Rivonia Rd, Sandhurst, Sandton, Johannesburg'),
('Pretoria, Gauteng', 'Union Buildings, Government Ave, Arcadia, Pretoria'),
('Soweto, Gauteng', 'Vilakazi St, Orlando West, Soweto, Johannesburg'),
('Sandton, Gauteng', 'Sandton Central, Sandton, Johannesburg'),
('Midrand, Gauteng', 'Mall of Africa, Lone Creek Cres, Waterval City, Midrand'),
('Randburg, Gauteng', 'Cresta Shopping Centre, Beyers Naude Dr, Cresta, Randburg'),
('Centurion, Gauteng', 'Centurion Mall, Heuwel Ave, Centurion Central, Centurion'),
('Roodepoort, Gauteng', 'Westgate Shopping Centre, Ontdekkers Rd, Horizon View, Roodepoort'),
('Krugersdorp, Gauteng', 'Key West Shopping Centre, Paardekraal Dr, Krugersdorp'),
('Benoni, Gauteng', 'Lakeside Mall, Tom Jones St, Benoni CBD, Benoni'),
('Boksburg, Gauteng', 'East Rand Mall, Bentel Ave, Jansen Park, Boksburg'),
('Germiston, Gauteng', 'Golden Walk Shopping Centre, Victoria St, Germiston'),
('Alberton, Gauteng', 'Alberton City Shopping Centre, Voortrekker Rd, New Redruth, Alberton'),
('Kempton Park, Gauteng', 'Festival Mall, Cnr CR Swart Dr & Kelvin St, Kempton Park'),
('Vereeniging, Gauteng', 'River Square Shopping Centre, Nile Dr, Three Rivers, Vereeniging'),
('Springs, Gauteng', 'Springs Mall, Jan Smuts Rd & Wit Rd, Springs New'),
('Durban, KwaZulu-Natal', 'Gateway Theatre of Shopping, 1 Palm Blvd, Umhlanga Ridge, Durban'),
('Pietermaritzburg, KwaZulu-Natal', 'Liberty Midlands Mall, Sanctuary Rd, Pietermaritzburg'),
('Umhlanga, KwaZulu-Natal', 'Gateway Blvd, Umhlanga, Durban'),
('Newcastle, KwaZulu-Natal', 'Amajuba Mall, Newcastle Central, Newcastle'),
('Richards Bay, KwaZulu-Natal', 'Boardwalk Inkwazi Shopping Centre, Mark Strasse, Richards Bay'),
('Pinetown, KwaZulu-Natal', 'Pavillion Shopping Centre, 5 Jack Martens Dr, Westville, Pinetown'),
('Cape Town, Western Cape', 'V&A Waterfront, Dock Rd, Cape Town'),
('Stellenbosch, Western Cape', 'Eikestad Mall, Andringa St, Stellenbosch Central, Stellenbosch'),
('Paarl, Western Cape', 'Paarl Mall, Cecelia St, Paarl'),
('George, Western Cape', 'Garden Route Mall, Knysna Rd, George'),
('Knysna, Western Cape', 'Knysna Mall, Waterfront Dr, Knysna Central, Knysna'),
('Mossel Bay, Western Cape', 'Langeberg Mall, Louis Fourie Rd, Mossel Bay'),
('Somerset West, Western Cape', 'Somerset Mall, Centenary Dr, Somerset West'),
('Bellville, Western Cape', 'Tyger Valley Shopping Centre, Willie Van Schoor Dr, Bellville'),
('East London, Eastern Cape', 'Hemingways Mall, Western Ave, East London'),
('Port Elizabeth, Eastern Cape', 'Walmer Park Shopping Centre, Main Rd, Walmer, Port Elizabeth'),
('Uitenhage, Eastern Cape', 'Penford Shopping Centre, Graaff Reinet Rd, Uitenhage'),
('King William’s Town, Eastern Cape', 'Metlife Mall, Buffalo Rd, King William’s Town'),
('Mthatha, Eastern Cape', 'BT Ngebs Mall, Errol Spring Ave, Mthatha'),
('Bloemfontein, Free State', 'Mimosa Mall, Kellner St, Brandwag, Bloemfontein'),
('Welkom, Free State', 'Goldfields Mall, Stateway & Buiten St, Welkom'),
('Kroonstad, Free State', 'Crossing Shopping Centre, Kroonstad Central, Kroonstad'),
('Sasolburg, Free State', 'Sasolburg Plaza, John Voster Rd, Sasolburg'),
('Rustenburg, North West', 'Waterfall Mall, Augrabies Ave, Cashan, Rustenburg'),
('Mahikeng, North West', 'The Crossing Mall, Sekame St, Mahikeng'),
('Potchefstroom, North West', 'MooiRivier Mall, Govan Mbeki Dr, Potchefstroom'),
('Klerksdorp, North West', 'City Mall Klerksdorp, Magaretha Prinsloo St, Klerksdorp'),
('Nelspruit, Mpumalanga', 'Ilanga Mall, Bitterbessie St, West Acres, Nelspruit'),
('Witbank, Mpumalanga', 'Highveld Mall, Mandela St, Die Heuwel, Witbank'),
('Secunda, Mpumalanga', 'Secunda Mall, PDP Kruger St, Secunda'),
('Polokwane, Limpopo', 'Mall of the North, R81, Bendor, Polokwane'),
('Thohoyandou, Limpopo', 'Thavhani Mall, Mphephu St, Thohoyandou'),
('Tzaneen, Limpopo', 'Tzaneen Lifestyle Centre, Danie Joubert St, Tzaneen'),
('Kimberley, Northern Cape', 'Kimberley Mall, MacDougall St, Kimberley'),
('Upington, Northern Cape', 'Kalahari Mall, Scott St, Upington');


-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL CHECK (year >= 1886 AND year <= EXTRACT(YEAR FROM CURRENT_DATE)), 
    category VARCHAR(50) NOT NULL CHECK (LOWER(category) IN ('economy', 'luxury', 'suv', 'sedan')), 
    price DOUBLE PRECISION NOT NULL DEFAULT 450.00,
    status VARCHAR(50) NOT NULL CHECK (LOWER(status) IN ('available', 'booked', 'maintenance', 'out of service', 'rented')), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle images
CREATE TABLE IF NOT EXISTS vehicle_images (
    image_id SERIAL PRIMARY KEY, 
    vehicle_id INT NOT NULL UNIQUE REFERENCES vehicles(vehicle_id) ON DELETE CASCADE, 
    filename VARCHAR(255) NOT NULL, 
    path VARCHAR(255) NOT NULL,
    size INT NOT NULL,
    mimetype VARCHAR(50) NOT NULL
);


-- Vehicle details
CREATE TABLE IF NOT EXISTS vehicle_details (
    vehicle_details_id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL UNIQUE REFERENCES vehicles(vehicle_id) ON DELETE CASCADE, 
    color VARCHAR(20) NOT NULL,
    number_seats INT NOT NULL CHECK (number_seats BETWEEN 2 AND 24), 
    mileage INT NOT NULL CHECK (mileage >= 0), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Vehicle fetaures
CREATE TABLE IF NOT EXISTS vehicle_features (
    feature_id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    has_gps BOOLEAN DEFAULT FALSE, 
    has_child_seats BOOLEAN DEFAULT FALSE, 
    has_parking_sensors BOOLEAN DEFAULT FALSE, 
    has_air_conditioning BOOLEAN DEFAULT FALSE, 
    has_bluetooth BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
    booking_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE, 
    vehicle_id INT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE, 
    check_out DATE NOT NULL CHECK (check_out >= CURRENT_DATE), 
    check_in DATE NOT NULL CHECK (check_in > check_out), 
    pick_up_location VARCHAR(100) NOT NULL,
    drop_off_location VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL, 
    total_days INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'in-progress' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'in-progress', 'rented')), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ALTER TABLE bookings 
-- ALTER COLUMN status SET DEFAULT 'in-progress';

-- Maintenance
CREATE TABLE IF NOT EXISTS maintenance (
    maintenance_id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicles(vehicle_id) ON DELETE CASCADE, 
    description TEXT NOT NULL, 
    scheduled_date DATE NOT NULL CHECK (scheduled_date >= CURRENT_DATE), 
    completed BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Booking history
CREATE TABLE IF NOT EXISTS booking_history (
    history_id SERIAL PRIMARY KEY,
    booking_id INT UNIQUE NOT NULL, 
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE, 
    vehicle_id INT REFERENCES vehicles(vehicle_id) ON DELETE CASCADE, 
    check_out DATE NOT NULL,
    check_in DATE NOT NULL,
    pick_up_location VARCHAR(100) NOT NULL,
    drop_off_location VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'cancelled')), 
    amount DECIMAL(10, 2) NOT NULL, 
    total_days INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for when the booking was completed
);


-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES booking_history(booking_id) ON DELETE CASCADE, 
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE, 
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0), 
    type_of_fee VARCHAR(45),
    additional_charges DECIMAL(10, 2) DEFAULT 0.00 CHECK (additional_charges >= 0), 
    total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (amount + additional_charges) STORED, -- Automatically calculated total
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    booking_id INT NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Update Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- update customers updated_at value
CREATE TRIGGER update_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


--  update staff updated_at value
CREATE TRIGGER update_updated_at
BEFORE UPDATE ON staff
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


--  update vehicles updated_at value
CREATE TRIGGER update_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


--  update vehicle_details updated_at value
CREATE TRIGGER update_updated_at
BEFORE UPDATE ON vehicle_details
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


--  update vehicle_features updated_at value
CREATE TRIGGER update_updated_at
BEFORE UPDATE ON vehicle_features
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

