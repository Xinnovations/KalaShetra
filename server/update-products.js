import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read existing products
const productsPath = path.join(__dirname, 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Artisan profiles with realistic contact info
const artisanProfiles = [
  {
    name: "Rajesh Kumar Sharma",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    instagram: "@rajesh_silk_weaver",
    facebook: "rajesh.kumar.weaver",
    location: "Varanasi, Uttar Pradesh"
  },
  {
    name: "Meera Devi",
    phone: "+91 91234 56789",
    whatsapp: "+91 91234 56789", 
    instagram: "@meera_pottery_art",
    facebook: "meera.pottery.artist",
    location: "Khurja, Uttar Pradesh"
  },
  {
    name: "Arjun Singh",
    phone: "+91 87654 32109",
    whatsapp: "+91 87654 32109",
    instagram: "@arjun_bronze_art",
    facebook: "arjun.bronze.sculptor",
    location: "Thanjavur, Tamil Nadu"
  },
  {
    name: "Priya Sharma",
    phone: "+91 76543 21098",
    whatsapp: "+91 76543 21098",
    instagram: "@priya_handloom",
    facebook: "priya.handloom.weaver",
    location: "Chanderi, Madhya Pradesh"
  },
  {
    name: "Vikram Patel",
    phone: "+91 65432 10987",
    whatsapp: "+91 65432 10987",
    instagram: "@vikram_crafts",
    facebook: "vikram.traditional.crafts",
    location: "Kutch, Gujarat"
  }
];

// Check for uploaded images in the uploads directory
const uploadsDir = path.join(__dirname, 'uploads', 'products');
let uploadedImages = [];

try {
  if (fs.existsSync(uploadsDir)) {
    uploadedImages = fs.readdirSync(uploadsDir)
      .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      .map(file => `/uploads/products/${file}`);
  }
} catch (error) {
  console.log('No uploads directory found or error reading it');
}

// Update each product
products.forEach((product, index) => {
  // Assign artisan profile cyclically
  const artisan = artisanProfiles[index % artisanProfiles.length];
  
  // Remove all demo Unsplash images and restore to empty or uploaded images
  if (uploadedImages.length > 0) {
    // Use uploaded images if available
    product.images = uploadedImages.slice(0, 3); // Max 3 images per product
  } else {
    // Clear images array - user will add their own
    product.images = [];
  }
  
  // Update contact info but keep original product details
  product.artisanName = artisan.name;
  product.phone = artisan.phone;
  product.whatsapp = artisan.whatsapp;
  product.instagram = artisan.instagram;
  product.facebook = artisan.facebook;
  product.region = artisan.location;
  
  // Ensure published status
  product.status = 'published';
  
  // Remove artificial ratings - let them be organic
  delete product.rating;
  delete product.reviewCount;
});

// Write updated products back to file
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

console.log(`✅ Cleaned up ${products.length} products!`);
console.log('�️  Removed all demo Unsplash images');
if (uploadedImages.length > 0) {
  console.log(`� Restored ${uploadedImages.length} original uploaded images`);
} else {
  console.log('📷 No uploaded images found - products ready for new image uploads');
}
console.log('📞 Kept realistic contact information and social media handles');
console.log('🎨 Products are clean and ready for your own images!');
