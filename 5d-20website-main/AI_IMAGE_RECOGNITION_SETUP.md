# AI Image Recognition Tool - Setup & Usage Guide

## 🚀 Quick Start

The AI Image Recognition Tool is now fully integrated into your e-commerce platform! Access it at:
**`/admin/ai-image-recognition`**

## 📋 What's Included

✅ **Complete AI Image Recognition System**

- Main UI component with drag & drop image upload
- Batch processing with progress tracking
- Individual product analyzer with editing capabilities
- CSV export matching your existing product format

✅ **Smart Features**

- AI-powered product analysis using GPT-4 Vision
- Automatic SKU generation (LFC- format)
- Price estimation based on product category
- Duplicate detection and validation
- Demo mode for testing without API key

✅ **Admin Integration**

- Accessible from AI Management Hub (`/ai-management`)
- Direct admin route (`/admin/ai-image-recognition`)
- Environment configuration

## ⚙️ Setup Instructions

### 1. Configure OpenAI API Key

Create or edit your `.env` file in the project root:

```env
# Add your OpenAI API key for real AI analysis
VITE_OPENAI_API_KEY=sk-proj-your-actual-api-key-here

# Get your API key from: https://platform.openai.com/api-keys
```

### 2. Access the Tool

**Option A: Through AI Management Hub**

1. Go to `/ai-management`
2. Click on "AI Image Recognition" in the Quick Access section

**Option B: Direct Admin Access**

1. Go directly to `/admin/ai-image-recognition`

### 3. Demo Mode (No API Key Required)

If no OpenAI API key is configured, the tool runs in **Demo Mode**:

- Generates realistic sample product data
- Shows the complete workflow
- Perfect for testing the interface
- No external API calls

## 📁 Image Preparation

### Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)
- BMP (.bmp)

### Best Practices

- Use clear, well-lit product images
- Include the full product in the frame
- Avoid heavy backgrounds or distractions
- Multiple angles can be processed separately

### Organized Products Folder

Based on your existing setup, organize your images in a folder structure like:

```
organized_products/
├── fashion/
│   ├── dresses/
│   ├── tops/
│   └── bottoms/
├── accessories/
│   ├── bags/
│   └── jewelry/
└── shoes/
```

## 🔧 Using the Tool

### Step 1: Upload Images

- Drag & drop images into the upload area
- Or click to browse and select files
- Supports multiple image selection

### Step 2: Process Images

- Click "Process Images" to start AI analysis
- Monitor progress in the Processing tab
- Batch processing handles multiple images efficiently

### Step 3: Review Results

- Switch to Results tab to see analyzed products
- Click on any product to view detailed analysis
- Edit product details if needed
- Check confidence scores

### Step 4: Export CSV

- Click "Export CSV" to download results
- CSV format matches your existing product database
- Includes all required fields for import

## 📊 Generated Data Structure

The tool generates CSV data with these fields (matching your existing format):

```csv
handleId,fieldType,name,description,productImageUrl,collection,sku,ribbon,price,surcharge,visible,discountMode,discountValue,inventory,weight,cost,brand,additionalInfoTitle1,additionalInfoDescription1
```

### Example Generated Data:

- **Handle ID**: `product_product_1703123456789`
- **SKU**: `LFC-DREBL-A1B2` (following your LFC- pattern)
- **Brand**: "Lilly's Fashion Couture"
- **Price**: AI-estimated based on category and features
- **Description**: Detailed AI-generated product description
- **Return Policy**: "30-day return policy. Contact us for details."

## 🔍 AI Analysis Features

### Product Details Extracted:

- Product name and category
- Detailed description (50-100 words)
- Color identification
- Material type (if visible)
- Style classification
- Brand recognition (if visible)
- Gender target audience
- Size information (if visible)

### Smart Generation:

- **SKU Generation**: `LFC-[TYPE][COLOR]-[RANDOM]`
- **Price Estimation**: Based on category, material, style
- **Confidence Scoring**: 0-1 scale for analysis reliability
- **Duplicate Detection**: Prevents duplicate product entries

## 🛠️ Troubleshooting

### Demo Mode Issues

- If you see "Demo Mode Active", add your OpenAI API key
- Demo mode generates sample data for testing
- No real AI analysis occurs without API key

### API Key Issues

- Ensure the key starts with `sk-proj-` or `sk-`
- Verify the key has sufficient credits
- Check the key has access to GPT-4 Vision model

### Upload Issues

- Ensure images are under 20MB each
- Check image formats are supported
- Clear browser cache if drag & drop fails

### CSV Export Issues

- Ensure you have processed products first
- Check browser allows file downloads
- Verify CSV data in the preview tab

## 🔗 Integration Points

### Existing System Compatibility

- **Product Database**: CSV format matches exactly
- **SKU System**: Follows LFC- prefix pattern
- **Image Storage**: Compatible with existing CDN
- **Admin Tools**: Integrated with current admin panels

### Related Admin Tools

- **CSV Image Matcher** (`/admin/csv-matcher`)
- **CSV Generator** (`/admin/csv-generator`)
- **CSV Debug Tools** (`/admin/csv-debug`)
- **Product Upload** (`/admin/products`)

## 📈 Next Steps

1. **Set up OpenAI API key** for real AI analysis
2. **Test with sample images** to verify functionality
3. **Process your organized_products folder** in batches
4. **Export and import CSV data** to your product database
5. **Replace manual image matching workflow**

## 💡 Tips for Best Results

- **Batch Processing**: Process 10-20 images at a time for optimal performance
- **Review and Edit**: Always review AI-generated data before export
- **Confidence Scores**: Focus on products with confidence > 0.7
- **Category Consistency**: Group similar products for processing
- **Price Validation**: Verify AI price estimates match your pricing strategy

---

🎉 **Your AI Image Recognition Tool is ready to use!**

For support or questions, the tool is fully integrated with your existing admin system and follows all established patterns and conventions.
