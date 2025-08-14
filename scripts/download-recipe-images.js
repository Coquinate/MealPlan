/**
 * Download Royalty-Free Recipe Images Script
 *
 * Downloads representative images for Romanian recipes from free stock photo sources
 * and uploads them to Supabase Storage bucket
 *
 * Usage: node scripts/download-recipe-images.js
 */

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');

async function downloadRecipeImages() {
  console.log('🚀 Starting recipe image download and upload...');

  // Load environment variables from .env file
  require('dotenv').config();

  // Initialize Supabase client with service role for admin operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Create temp directory for downloads
  const tempDir = path.join(__dirname, '../temp/recipe-images');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Recipe images mapping to free stock photos (Unsplash/Pexels placeholders)
  const recipeImages = [
    {
      id: 'b0000001-0000-0000-0000-000000000001',
      title: 'Clătite cu dulceață',
      url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'clatite-cu-dulceata.jpg',
    },
    {
      id: 'b0000001-0000-0000-0000-000000000002',
      title: 'Ciorbă de fasole',
      url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'ciorba-de-fasole.jpg',
    },
    {
      id: 'b0000001-0000-0000-0000-000000000003',
      title: 'Sarmale cu mămăligă',
      url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'sarmale-cu-mamaliga.jpg',
    },
    {
      id: 'b0000001-0000-0000-0000-000000000004',
      title: 'Plăcintă cu brânză',
      url: 'https://images.unsplash.com/photo-1549007021-bd4c1e02d395?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'placinta-cu-branza.jpg',
    },
    {
      id: 'b0000001-0000-0000-0000-000000000005',
      title: 'Ouă ochiuri cu șuncă',
      url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'oua-ochiuri-cu-sunca.jpg',
    },
    {
      id: 'b0000001-0000-0000-0000-000000000006',
      title: 'Sandwich cu friptură rece',
      url: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'sandwich-cu-friptura-rece.jpg',
    },
    {
      id: 'b0000001-0000-0000-0000-000000000007',
      title: 'Friptură de porc la cuptor',
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'friptura-de-porc-la-cuptor.jpg',
    },
    {
      id: 'b0000001-0000-0000-0000-000000000008',
      title: 'Papanași cu gem și smântână',
      url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'papanasi-cu-gem-si-smantana.jpg',
    },
    {
      id: 'b0000001-0000-0000-0000-000000000009',
      title: 'Mămăligă cu brânză și smântână',
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'mamaliga-cu-branza-si-smantana.jpg',
    },
    {
      id: 'b0000001-0000-0000-0000-000000000010',
      title: 'Ciorbă de burtă',
      url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'ciorba-de-burta.jpg',
    },
    {
      id: 'b0000001-0000-0000-0000-000000000011',
      title: 'Mici cu muștar și pâine',
      url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'mici-cu-mustar-si-paine.jpg',
    },
    {
      id: 'b0000001-0000-0000-0000-000000000012',
      title: 'Salată de icre cu pâine prăjită',
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'salata-de-icre-cu-paine-prajita.jpg',
    },
  ];

  console.log(`📋 Processing ${recipeImages.length} recipe images...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const recipe of recipeImages) {
    try {
      console.log(`🔽 Downloading: ${recipe.title}...`);

      // Download image to temp directory
      const localPath = path.join(tempDir, recipe.filename);
      await downloadImage(recipe.url, localPath);

      console.log(`   ✅ Downloaded to: ${localPath}`);

      // Read file for upload
      const fileBuffer = fs.readFileSync(localPath);
      const file = new File([fileBuffer], recipe.filename, { type: 'image/jpeg' });

      console.log(`   ⬆️  Uploading to Supabase Storage...`);

      // Upload to Supabase Storage
      const storagePath = `${recipe.id}/${recipe.filename}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(storagePath, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from('recipe-images').getPublicUrl(storagePath);

      const imageUrl = urlData.publicUrl;

      console.log(`   🔗 Public URL: ${imageUrl}`);

      // Update recipe in database
      console.log(`   💾 Updating database record...`);

      const { error: updateError } = await supabase
        .from('recipes')
        .update({
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', recipe.id);

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      console.log(`   ✅ Successfully processed: ${recipe.title}\n`);
      successCount++;

      // Clean up temp file
      fs.unlinkSync(localPath);
    } catch (error) {
      console.error(`   ❌ Error processing ${recipe.title}: ${error.message}\n`);
      errorCount++;
    }
  }

  // Clean up temp directory
  try {
    fs.rmSync(tempDir, { recursive: true });
  } catch (error) {
    console.warn('⚠️  Could not clean up temp directory:', error.message);
  }

  console.log('🎉 Recipe image processing completed!');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);

  if (successCount > 0) {
    console.log('\n📋 Next steps:');
    console.log('   1. Test image loading in the web application');
    console.log('   2. Verify responsive sizing on different devices');
    console.log('   3. Check image optimization through Vercel');
    console.log('   4. Test fallback behavior for any remaining null images');
  }
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: HTTP ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve();
        });

        file.on('error', (error) => {
          fs.unlink(filepath, () => {}); // Delete the file on error
          reject(error);
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Mock File class for Node.js environment
if (typeof File === 'undefined') {
  global.File = class File {
    constructor(buffer, name, options = {}) {
      this.buffer = buffer;
      this.name = name;
      this.type = options.type || 'application/octet-stream';
      this.size = buffer.length;
      this.lastModified = Date.now();
    }
  };
}

// Run if called directly
if (require.main === module) {
  downloadRecipeImages()
    .then(() => {
      console.log('📸 Image download and upload process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Process failed:', error);
      process.exit(1);
    });
}

module.exports = { downloadRecipeImages };
