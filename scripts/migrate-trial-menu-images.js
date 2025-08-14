/**
 * Migration Script: Trial Menu Images to Fallback System
 *
 * This script migrates trial menu recipes from placeholder URLs to the fallback image system.
 * Since the current image URLs are just placeholders (no actual files), we set them to NULL
 * so the RecipeImage component will show the Romanian food placeholder instead.
 *
 * Usage: node scripts/migrate-trial-menu-images.js
 */

const { createClient } = require('@supabase/supabase-js');

async function migrateTrialMenuImages() {
  console.log('🚀 Starting trial menu image migration...');

  // Load environment variables from .env file
  require('dotenv').config();

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    console.error('');
    console.error('💡 Make sure to create a .env file with these variables:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
    console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Step 1: Find all published recipes with placeholder image URLs
    console.log('📋 Fetching trial menu recipes...');

    const { data: recipes, error: fetchError } = await supabase
      .from('recipes')
      .select('id, title_ro, image_url, status')
      .eq('status', 'published')
      .like('image_url', '/images/recipes/trial-%');

    if (fetchError) {
      throw new Error(`Failed to fetch recipes: ${fetchError.message}`);
    }

    console.log(`📊 Found ${recipes?.length || 0} recipes with placeholder image URLs`);

    if (!recipes || recipes.length === 0) {
      console.log('✅ No migration needed - no placeholder URLs found');
      return;
    }

    // Step 2: Show what will be updated
    console.log('\n📋 Recipes to update:');
    recipes.forEach((recipe, index) => {
      console.log(`   ${index + 1}. ${recipe.title_ro}`);
      console.log(`      Current: ${recipe.image_url}`);
      console.log(`      New: NULL (will use fallback)`);
    });

    // Step 3: Confirm migration (in production, you'd want user confirmation)
    console.log('\n🔄 Updating recipe image URLs to NULL...');

    // Update all matching recipes to use NULL image_url (triggers fallback system)
    const { data: updateData, error: updateError } = await supabase
      .from('recipes')
      .update({
        image_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq('status', 'published')
      .like('image_url', '/images/recipes/trial-%')
      .select('id, title_ro, image_url');

    if (updateError) {
      throw new Error(`Failed to update recipes: ${updateError.message}`);
    }

    console.log(`✅ Successfully updated ${updateData?.length || 0} recipes`);

    // Step 4: Verify the updates
    console.log('\n🔍 Verifying migration...');

    const { data: verifyRecipes, error: verifyError } = await supabase
      .from('recipes')
      .select('id, title_ro, image_url')
      .in(
        'id',
        recipes.map((r) => r.id)
      );

    if (verifyError) {
      throw new Error(`Failed to verify migration: ${verifyError.message}`);
    }

    const nullCount = verifyRecipes?.filter((r) => r.image_url === null).length || 0;
    console.log(`📊 Verification: ${nullCount}/${recipes.length} recipes now have NULL image_url`);

    if (nullCount === recipes.length) {
      console.log('✅ Migration completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('   1. Test the fallback image system in the web app');
      console.log('   2. Upload actual recipe images using the admin dashboard');
      console.log('   3. Update recipe records with new Supabase Storage URLs');
    } else {
      console.log('⚠️  Migration partially completed - some records may need manual review');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Document rollback procedure
function showRollbackInstructions() {
  console.log('\n📝 Rollback Instructions:');
  console.log('   To rollback this migration, run the following SQL:');
  console.log('   ');
  console.log("   UPDATE recipes SET image_url = '/images/recipes/trial-' || ");
  console.log("   LOWER(REPLACE(REPLACE(title_ro, ' ', '-'), 'ă', 'a')) || '.jpg'");
  console.log("   WHERE image_url IS NULL AND status = 'published';");
  console.log('   ');
  console.log('   Note: This will restore placeholder URLs, not actual images.');
}

// Run migration if called directly
if (require.main === module) {
  migrateTrialMenuImages()
    .then(() => {
      console.log('\n🎉 Migration process completed!');
      showRollbackInstructions();
    })
    .catch((error) => {
      console.error('💥 Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateTrialMenuImages, showRollbackInstructions };
