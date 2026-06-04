-- Create contacts table for general inquiries
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  message TEXT NOT NULL,
  inquiry_type VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create demo_requests table for demo scheduling
CREATE TABLE IF NOT EXISTS demo_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  industry VARCHAR(100),
  company_size VARCHAR(50),
  current_challenges TEXT,
  preferred_date DATE,
  preferred_time VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_subscribers table for future use
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON demo_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_inquiry_type ON contacts(inquiry_type);
