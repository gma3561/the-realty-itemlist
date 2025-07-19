// Script to check Supabase permissions and access levels
const { createClient } = require('@supabase/supabase-js');

// Supabase connection details (same as in supabaseClient.js)
const supabaseUrl = 'https://qwxghpwasmvottahchky.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3eGdocHdhc212b3R0YWhjaGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTI3NTksImV4cCI6MjA2ODQ4ODc1OX0.4a1Oc66k9mGmXLoHmrKyZiVeZISpyzgq1BERrb_-8n8';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPermissions() {
  console.log('==== Checking Supabase Permissions ====');
  
  // Test tables with different operations to check permissions
  const tablesToTest = ['properties', 'public_properties', 'user_profiles', 'profiles'];
  const operations = ['select', 'insert', 'update', 'delete'];
  
  for (const table of tablesToTest) {
    console.log(`\n== Testing permissions for table: ${table} ==`);
    
    // Test SELECT
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`SELECT: ❌ - ${error.message}`);
      } else {
        console.log(`SELECT: ✅ - Can read from ${table}`);
        console.log(`  Data returned: ${data && data.length > 0 ? 'Yes' : 'No'}`);
      }
    } catch (err) {
      console.log(`SELECT: ❌ - Exception: ${err.message}`);
    }
    
    // Test INSERT (with a dummy record we'll roll back)
    try {
      // Start a transaction that we'll roll back
      const { error } = await supabase
        .from(table)
        .insert({ 
          test_column: 'test_value', 
          created_at: new Date().toISOString() 
        })
        .select()
        .abortSignal(new AbortController().signal);
        
      // This should fail for permissions reasons before the abort happens
      if (error) {
        if (error.code === '42703') {
          console.log(`INSERT: ❓ - Column doesn't exist (schema unknown)`);
        } else if (error.code === '42P01') {
          console.log(`INSERT: ❌ - Table doesn't exist (${error.message})`);
        } else if (error.code.startsWith('2') || error.code.startsWith('42')) {
          console.log(`INSERT: ❓ - Schema error: ${error.message}`);
        } else {
          console.log(`INSERT: ❌ - Permission denied: ${error.message}`);
        }
      } else {
        console.log(`INSERT: ✅ - Can insert into ${table}`);
      }
    } catch (err) {
      console.log(`INSERT: ❌ - Exception: ${err.message}`);
    }
  }
  
  // Check if RLS (Row Level Security) might be blocking access
  console.log('\n== Testing for Row Level Security ==');
  try {
    // Try to get the total count of rows in a table
    const { count, error } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.log(`RLS Test: Error - ${error.message}`);
    } else {
      console.log(`RLS Test: Count result is ${count === null ? 'NULL' : count}`);
      if (count === null) {
        console.log('  This suggests RLS might be restricting your access.');
        console.log('  The table exists but the policy is preventing row access.');
      } else if (count === 0) {
        console.log('  Table exists but is empty.');
      } else {
        console.log(`  You have access to ${count} rows.`);
      }
    }
  } catch (err) {
    console.log(`RLS Test: Exception - ${err.message}`);
  }
  
  // Check if we can get database metadata
  console.log('\n== Testing Database Metadata Access ==');
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10);
      
    if (error) {
      console.log(`Metadata: ❌ - ${error.message}`);
      console.log('  This is normal - anon keys usually cannot access system tables.');
    } else {
      console.log(`Metadata: ✅ - Can access system tables`);
      console.log(`  Tables: ${data.map(t => t.table_name).join(', ')}`);
    }
  } catch (err) {
    console.log(`Metadata: ❌ - Exception: ${err.message}`);
  }
}

// Run the checks
checkPermissions();