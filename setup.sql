-- Create the chat_history table
CREATE TABLE chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    role TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    quality_metrics JSONB,
    rule_violations TEXT[]
);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
    ON chat_history
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create a policy that allows anonymous users to read all records
CREATE POLICY "Allow anonymous users to read"
    ON chat_history
    FOR SELECT
    TO anon
    USING (true); 