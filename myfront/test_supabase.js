const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vkybwmgwfkalbqnqumwn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZreWJ3bWd3ZmthbGJxbnF1bXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NjYyMTIsImV4cCI6MjA5MzQ0MjIxMn0.VNsjtRUseC1ikRZ-KX5Wkg1WsZImrHD6FFH8-8M5uNM';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing env vars!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("Testing Supabase connection to:", supabaseUrl);
  
  // Test Insert
  console.log("Attempting insert...");
  const { data: insertData, error: insertError } = await supabase
    .from('messages')
    .insert([{ name: 'Test User', mobile: '1234567890', message: 'This is a test message' }]);
    
  if (insertError) {
    console.error("❌ Insert failed:");
    console.error(insertError);
  } else {
    console.log("✅ Insert successful!");
  }

  // Test Fetch
  console.log("Attempting fetch...");
  const { data: fetchData, error: fetchError } = await supabase
    .from('messages')
    .select('*');
    
  if (fetchError) {
    console.error("❌ Fetch failed:");
    console.error(fetchError);
  } else {
    console.log("✅ Fetch successful, retrieved", fetchData?.length, "records.");
    console.log(fetchData);
  }
}

testConnection();
