// Comprehensive script to check Supabase tables with detailed debugging
const { createClient } = require('@supabase/supabase-js');

// Supabase connection details (same as in supabaseClient.js)
const supabaseUrl = 'https://qwxghpwasmvottahchky.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3eGdocHdhc212b3R0YWhjaGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTI3NTksImV4cCI6MjA2ODQ4ODc1OX0.4a1Oc66k9mGmXLoHmrKyZiVeZISpyzgq1BERrb_-8n8';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check a single table
async function checkTable(tableName) {
  console.log(`\nChecking table: ${tableName}`);
  
  try {
    // First approach: Simple count
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.log(`  [ERROR] ${error.message}`);
      return false;
    } else {
      console.log(`  ✅ Table exists with ${count} records`);
      
      // Check structure
      const { data: sampleRow, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
        
      if (!sampleError && sampleRow && sampleRow.length > 0) {
        console.log(`  Structure: ${Object.keys(sampleRow[0]).join(', ')}`);
      }
      
      return true;
    }
  } catch (err) {
    console.log(`  [EXCEPTION] ${err.message}`);
    return false;
  }
}

// Main function
async function diagnoseSupabase() {
  console.log('==== Supabase Database Diagnosis ====');
  console.log(`URL: ${supabaseUrl}`);
  console.log('Time:', new Date().toISOString());
  
  // List of tables to check based on code analysis
  const tablesToCheck = [
    'properties',
    'public_properties',
    'user_profiles',
    'profiles',
    'users',
    'auth_users',
    'property',
    'items',
    'projects'
  ];
  
  // Results tracking
  const results = {};
  
  // Check each table
  for (const table of tablesToCheck) {
    results[table] = await checkTable(table);
  }
  
  // Check authentication
  console.log('\n==== Authentication Check ====');
  try {
    const { data: session } = await supabase.auth.getSession();
    if (session) {
      console.log('Session found:', !!session.session);
    } else {
      console.log('No active session');
    }
  } catch (err) {
    console.log('Error checking session:', err.message);
  }
  
  // Summary
  console.log('\n==== Summary ====');
  const existingTables = Object.keys(results).filter(t => results[t]);
  
  if (existingTables.length > 0) {
    console.log('Existing tables:', existingTables.join(', '));
  } else {
    console.log('No tables found or accessible with current permissions');
  }

  // Try one special query to check for real tables that might have different names
  console.log('\n==== Special Queries ====');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
      
    if (!error) {
      console.log('Special query to "profiles" succeeded.');
      console.log('Sample data structure:', data.length > 0 ? Object.keys(data[0]).join(', ') : 'No records');
    }
  } catch (err) {
    console.log('Special query error:', err.message);
  }
  
  // Try an arbitrary SQL query if RLS allows it
  try {
    const { data, error } = await supabase
      .rpc('current_database');
      
    if (!error) {
      console.log('Database name:', data);
    }
  } catch (err) {
    console.log('Cannot execute SQL function current_database:', err.message);
  }
}

// Run the diagnosis
diagnoseSupabase();