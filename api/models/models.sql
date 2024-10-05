-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    names VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR DEFAULT 'customer' NOT NULL,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- INSERT staff
INSERT INTO staff (names, phone, email, password, role) VALUES
    ('John Skales', '0724569867', 'admin@email.com', 'admin', 'admin');


-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL CHECK (year >= 1886 AND year <= EXTRACT(YEAR FROM CURRENT_DATE)), 
    category VARCHAR(50) NOT NULL CHECK (LOWER(category) IN ('economy', 'luxury', 'suv', 'sedan')), 
    status VARCHAR(50) NOT NULL CHECK (LOWER(status) IN ('available', 'booked', 'maintenance', 'out of service')), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    vehicle_id INT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE, -- Each vehicle has a set of features
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
    customer_id INT UNIQUE NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE, 
    vehicle_id INT UNIQUE NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE, 
    check_out DATE NOT NULL CHECK (check_out >= CURRENT_DATE), 
    check_in DATE NOT NULL CHECK (check_in > check_out), 
    pick_up_location VARCHAR(100) NOT NULL,
    drop_off_location VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'in-progress' CHECK (status IN ('confirmed', 'completed', 'canceled', 'in-progress')), 
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


-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(booking_id) ON DELETE CASCADE, 
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE, 
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0), 
    additional_charges DECIMAL(10, 2) DEFAULT 0.00 CHECK (additional_charges >= 0), 
    total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (amount + additional_charges) STORED, -- Automatically calculated total
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Booking history
CREATE TABLE IF NOT EXISTS booking_history (
    history_id SERIAL PRIMARY KEY,
    booking_id INT UNIQUE NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE, 
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE, 
    vehicle_id INT REFERENCES vehicles(vehicle_id) ON DELETE CASCADE, 
    check_out DATE NOT NULL,
    check_in DATE NOT NULL,
    pick_up_location VARCHAR(100) NOT NULL,
    drop_off_location VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'cancelled')), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for when the booking was completed
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


-- Trigger to move completed bookings
CREATE OR REPLACE FUNCTION move_completed_booking()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert the completed booking into the booking_history table
    INSERT INTO booking_history (booking_id, customer_id, vehicle_id, check_out, check_in, pick_up_location, drop_off_location, status, created_at, completed_at)
    VALUES (NEW.booking_id, NEW.customer_id, NEW.vehicle_id, NEW.check_out, NEW.check_in, NEW.pick_up_location, NEW.drop_off_location, NEW.status, NEW.created_at, CURRENT_TIMESTAMP);
    
    -- Delete the completed booking from bookings
    DELETE FROM bookings WHERE booking_id = NEW.booking_id;
    
    RETURN NULL; -- return NULL (delete from bookings)
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_move_completed_booking
AFTER UPDATE OF status ON bookings
FOR EACH ROW
WHEN (NEW.status = 'completed') -- Only trigger on completed bookings
EXECUTE FUNCTION move_completed_booking();


-- Need trigger to update car availability upon return