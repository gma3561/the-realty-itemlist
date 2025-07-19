// Script to check if required Supabase tables exist
const { createClient } = require('@supabase/supabase-js');

// Supabase connection details (same as in supabaseClient.js)
const supabaseUrl = 'https://qwxghpwasmvottahchky.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3eGdocHdhc212b3R0YWhjaGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTI3NTksImV4cCI6MjA2ODQ4ODc1OX0.4a1Oc66k9mGmXLoHmrKyZiVeZISpyzgq1BERrb_-8n8';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('Checking Supabase tables...');
  
  try {
    // Check properties table
    console.log('\n--- Checking properties table ---');
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .limit(1);
      
    if (propertiesError) {
      console.error('Error checking properties table:', propertiesError.message);
    } else {
      console.log('✅ properties table exists');
      
      // Get count of records
      const { count, error: countError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        console.error('Error getting properties count:', countError.message);
      } else {
        console.log(`   Total records: ${count}`);
      }
      
      // Get the first record as a sample
      if (properties && properties.length > 0) {
        console.log('   Sample record columns:', Object.keys(properties[0]).join(', '));
      }
    }
    
    // Check public_properties view
    console.log('\n--- Checking public_properties view/table ---');
    const { data: publicProperties, error: publicPropertiesError } = await supabase
      .from('public_properties')
      .select('*', { count: 'exact' })
      .limit(1);
      
    if (publicPropertiesError) {
      console.error('Error checking public_properties view/table:', publicPropertiesError.message);
    } else {
      console.log('✅ public_properties view/table exists');
      
      // Get count of records
      const { count, error: countError } = await supabase
        .from('public_properties')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        console.error('Error getting public_properties count:', countError.message);
      } else {
        console.log(`   Total records: ${count}`);
      }
      
      // Get the first record as a sample
      if (publicProperties && publicProperties.length > 0) {
        console.log('   Sample record columns:', Object.keys(publicProperties[0]).join(', '));
      }
    }
    
    // Check user_profiles table
    console.log('\n--- Checking user_profiles table ---');
    const { data: userProfiles, error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
      
    if (userProfilesError) {
      console.error('Error checking user_profiles table:', userProfilesError.message);
    } else {
      console.log('✅ user_profiles table exists');
      
      // Get count of records
      const { count, error: countError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        console.error('Error getting user_profiles count:', countError.message);
      } else {
        console.log(`   Total records: ${count}`);
      }
      
      // Get the first record as a sample
      if (userProfiles && userProfiles.length > 0) {
        console.log('   Sample record columns:', Object.keys(userProfiles[0]).join(', '));
      }
    }
    
    // List all tables in the database
    console.log('\n--- All available tables ---');
    
    try {
      // Perform a direct RPC call to list available tables
      const { data: tables, error } = await supabase.rpc('list_tables');
      
      if (error) {
        console.log('Error listing tables:', error.message);
        console.log('Note: The function "list_tables" might not exist in your Supabase instance');
      } else {
        console.log('Available tables:', tables);
      }
    } catch (error) {
      console.log('Error listing tables:', error.message);
      
      // Try using system schema if RPC fails
      try {
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public');
          
        if (error) {
          console.log('Error accessing information_schema:', error.message);
        } else {
          console.log('Tables from information_schema:', data.map(t => t.table_name).join(', '));
        }
      } catch (err) {
        console.log('Could not list tables from information_schema either:', err.message);
      }
    }
    
    // Try to list tables by checking for common table names
    console.log('\n--- Attempting to detect tables by common names ---');
    const commonTables = [
      'properties', 
      'public_properties', 
      'user_profiles', 
      'profiles', 
      'users', 
      'auth_users',
      'property', 
      'users', 
      'user_profiles'
    ];
    
    for (const tableName of commonTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
          
        if (!error) {
          console.log(`✅ Table '${tableName}' exists`);
        }
      } catch (err) {
        // Skip reporting non-existent tables
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the check
checkTables();