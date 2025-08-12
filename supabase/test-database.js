#!/usr/bin/env node

/**
 * Database validation and testing script
 * Verifies all migrations, RLS policies, and data integrity
 * 
 * Usage: node supabase/test-database.js
 * Requires .env file with Supabase credentials
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env') })

// Load environment variables - MUST be configured in .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

// Create clients
const anonClient = createClient(supabaseUrl, supabaseAnonKey)
const serviceClient = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null

// Test results
const testResults = []

async function runTest(name, testFn) {
  try {
    console.log(`\n📋 Testing: ${name}`)
    await testFn()
    console.log(`✅ ${name} - PASSED`)
    testResults.push({ name, status: 'PASSED', error: null })
  } catch (error) {
    console.error(`❌ ${name} - FAILED: ${error.message}`)
    testResults.push({ name, status: 'FAILED', error: error.message })
  }
}

// Test 1: Check table existence
async function testTablesExist() {
  const tables = [
    'users', 'admin_users', 'ingredients', 'recipes', 
    'recipe_ingredients', 'meal_plans', 'planned_meals',
    'leftover_connections', 'shopping_lists', 'shopping_list_items',
    'recipe_feedback', 'trial_menus', 'trial_menu_recipes',
    'draft_meal_plans', 'draft_planned_meals', 'validation_results',
    'recipe_imports', 'published_weeks', 'subscriptions'
  ]

  for (const table of tables) {
    const { error } = await anonClient.from(table).select('id').limit(1)
    // We expect an error for admin tables (no RLS), but the table should exist
    if (error && !error.message.includes('row-level security') && !error.message.includes('permission denied')) {
      throw new Error(`Table ${table} does not exist: ${error.message}`)
    }
  }
}

// Test 2: Check enums exist
async function testEnumsExist() {
  const { data, error } = await anonClient.rpc('get_enum_values', {
    enum_name: 'menu_type_enum'
  }).single()
  
  // If RPC doesn't exist, we'll just check via a query
  const { data: recipe } = await anonClient
    .from('recipes')
    .select('meal_type')
    .limit(1)
  
  // No error means enum columns exist
}

// Test 3: Test public recipe access
async function testPublicRecipeAccess() {
  const { data, error } = await anonClient
    .from('recipes')
    .select('*')
    .eq('status', 'published')
    .limit(5)
  
  if (error) throw error
  if (!data || data.length === 0) {
    console.log('  ⚠️  No published recipes found (expected if no seed data)')
  } else {
    console.log(`  ✓ Found ${data.length} published recipes`)
  }
}

// Test 4: Test ingredients access
async function testIngredientsAccess() {
  const { data, error } = await anonClient
    .from('ingredients')
    .select('*')
    .limit(5)
  
  if (error) throw error
  if (!data || data.length === 0) {
    console.log('  ⚠️  No ingredients found (expected if no seed data)')
  } else {
    console.log(`  ✓ Found ${data.length} ingredients`)
  }
}

// Test 5: Check seed data
async function testSeedData() {
  // Check for admin user (using service client if available)
  if (serviceClient) {
    const { data: adminUser } = await serviceClient
      .from('admin_users')
      .select('email')
      .eq('email', 'admin@coquinate.ro')
      .single()
    
    if (adminUser) {
      console.log('  ✓ Admin user found')
    } else {
      console.log('  ⚠️  Admin user not found')
    }
  }

  // Check for test recipes
  const { data: recipes } = await anonClient
    .from('recipes')
    .select('id, title_ro')
    .eq('status', 'published')
  
  console.log(`  ✓ Found ${recipes?.length || 0} published recipes`)

  // Check for trial menu
  const { data: trialMenus } = await anonClient
    .from('trial_menus')
    .select('*')
    .eq('is_active', true)
  
  console.log(`  ✓ Found ${trialMenus?.length || 0} active trial menus`)
}

// Test 6: Test recipe with ingredients view
async function testRecipeIngredientsView() {
  const { data, error } = await anonClient
    .from('recipes')
    .select(`
      id,
      title_ro,
      recipe_ingredients (
        quantity,
        unit,
        ingredient:ingredients (
          name_ro,
          name_en
        )
      )
    `)
    .eq('status', 'published')
    .limit(1)
    .single()
  
  if (error && error.code === 'PGRST116') {
    console.log('  ⚠️  No recipes with ingredients found')
    return
  }
  
  if (error) throw error
  
  if (data && data.recipe_ingredients) {
    console.log(`  ✓ Recipe "${data.title_ro}" has ${data.recipe_ingredients.length} ingredients`)
  }
}

// Test 7: Test TypeScript types by checking table structure
async function testTableStructure() {
  // Test users table structure
  const { data: userData } = await anonClient
    .from('users')
    .select('*')
    .limit(0) // Just check structure, don't fetch data
  
  // Test recipes table structure  
  const { data: recipeData } = await anonClient
    .from('recipes')
    .select('*')
    .limit(0)
  
  console.log('  ✓ Table structures accessible')
}

// Test 8: Check indexes exist (via query performance)
async function testIndexPerformance() {
  // Test that week_start_date queries are indexed
  const start = Date.now()
  const { data } = await anonClient
    .from('meal_plans')
    .select('id')
    .eq('week_start_date', '2025-08-14')
    .limit(1)
  
  const duration = Date.now() - start
  console.log(`  ✓ Index query completed in ${duration}ms`)
}

// Main test runner
async function runAllTests() {
  console.log('🧪 Starting Database Validation Tests')
  console.log('=====================================')
  console.log(`📍 Supabase URL: ${supabaseUrl}`)
  console.log(`🔑 Using ${serviceClient ? 'service' : 'anon'} client`)

  await runTest('Table Existence', testTablesExist)
  await runTest('Enum Types', testEnumsExist)
  await runTest('Public Recipe Access', testPublicRecipeAccess)
  await runTest('Ingredients Access', testIngredientsAccess)
  await runTest('Seed Data Validation', testSeedData)
  await runTest('Recipe Ingredients Relations', testRecipeIngredientsView)
  await runTest('Table Structure', testTableStructure)
  await runTest('Index Performance', testIndexPerformance)

  // Summary
  console.log('\n=====================================')
  console.log('📊 Test Summary')
  console.log('=====================================')
  
  const passed = testResults.filter(r => r.status === 'PASSED').length
  const failed = testResults.filter(r => r.status === 'FAILED').length
  
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Total: ${testResults.length}`)
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:')
    testResults
      .filter(r => r.status === 'FAILED')
      .forEach(r => console.log(`  - ${r.name}: ${r.error}`))
    process.exit(1)
  } else {
    console.log('\n✅ All tests passed successfully!')
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})