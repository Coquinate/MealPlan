/**
 * Fix Missing Recipe Images Script
 * Downloads alternative images for the 2 recipes that failed
 */

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');

async function fixMissingImages() {
  console.log('🔧 Fixing missing recipe images...');

  require('dotenv').config();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const tempDir = path.join(__dirname, '../temp/fix-images');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Alternative images for the failed recipes
  const missingImages = [
    {
      id: 'b0000001-0000-0000-0000-000000000004',
      title: 'Plăcintă cu brânză',
      url: 'https://images.unsplash.com/photo-1586985289906-406988974504?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'placinta-cu-branza.jpg',
    },
    {
      id: 'b0000001-0000-0000-0000-000000000009',
      title: 'Mămăligă cu brânză și smântână',
      url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop&crop=center&q=80',
      filename: 'mamaliga-cu-branza-si-smantana.jpg',
    },
  ];

  let successCount = 0;

  for (const recipe of missingImages) {
    try {
      console.log(`🔽 Downloading: ${recipe.title}...`);

      const localPath = path.join(tempDir, recipe.filename);
      await downloadImage(recipe.url, localPath);

      const fileBuffer = fs.readFileSync(localPath);

      const storagePath = `${recipe.id}/${recipe.filename}`;
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(storagePath, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage.from('recipe-images').getPublicUrl(storagePath);

      const imageUrl = urlData.publicUrl;

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

      console.log(`   ✅ Fixed: ${recipe.title} → ${imageUrl}`);
      successCount++;

      fs.unlinkSync(localPath);
    } catch (error) {
      console.error(`   ❌ Failed: ${recipe.title} - ${error.message}`);
    }
  }

  fs.rmSync(tempDir, { recursive: true });
  console.log(`🎉 Fixed ${successCount}/2 missing images`);
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve();
        });

        file.on('error', (error) => {
          fs.unlink(filepath, () => {});
          reject(error);
        });
      })
      .on('error', reject);
  });
}

if (require.main === module) {
  fixMissingImages();
}
