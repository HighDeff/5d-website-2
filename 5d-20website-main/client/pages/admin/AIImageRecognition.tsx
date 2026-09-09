import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Brain, Image, Database, Download, Info } from "lucide-react";
import ImageRecognitionTool from "../../components/ImageRecognitionTool";

const AIImageRecognition: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Image Recognition
            </h1>
            <p className="text-gray-600 mt-1">
              Automatically analyze product images and generate CSV data
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            <Brain className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Image className="h-4 w-4 text-blue-600" />
                Image Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload product images and get detailed AI analysis including
                name, description, category, colors, and material
                identification.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4 text-green-600" />
                Data Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatically generates SKUs, handle IDs, product descriptions,
                and pricing suggestions based on AI analysis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Download className="h-4 w-4 text-purple-600" />
                CSV Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Export results in CSV format matching your existing product
                database structure for easy import.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* API Key Status & Usage Information */}
        {!import.meta.env.VITE_OPENAI_API_KEY ? (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode Active:</strong> OpenAI API key not configured.
              The tool will generate sample product data for testing. To enable
              real AI analysis, add your OpenAI API key to the{" "}
              <code className="bg-gray-100 px-1 rounded">
                VITE_OPENAI_API_KEY
              </code>{" "}
              environment variable.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>AI Analysis Active:</strong> OpenAI API configured. Upload
              product images to get real AI-powered analysis with detailed
              product information, automatic SKU generation, and CSV export.
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>How it works:</strong> Upload product images, wait for AI
            analysis, review the generated product details, and export as CSV.
            The system automatically generates SKUs following the LFC- format
            and creates handle IDs compatible with your existing product
            database.
          </AlertDescription>
        </Alert>

        {/* Main Tool */}
        <ImageRecognitionTool />

        {/* Technical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Technical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-sm mb-2">Supported Formats</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• JPEG (.jpg, .jpeg)</li>
                  <li>• PNG (.png)</li>
                  <li>• WebP (.webp)</li>
                  <li>• GIF (.gif)</li>
                  <li>• BMP (.bmp)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-2">
                  Generated Data Fields
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Product name and description</li>
                  <li>• Category and product type</li>
                  <li>• Color identification</li>
                  <li>• Material and style detection</li>
                  <li>• SKU and handle ID generation</li>
                  <li>• Price estimation</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-2">AI Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• GPT-4 Vision API integration</li>
                  <li>• Batch processing support</li>
                  <li>• Duplicate detection</li>
                  <li>• Confidence scoring</li>
                  <li>• Manual editing capabilities</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-2">Export Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• CSV format matching existing structure</li>
                  <li>• Lilly's Fashion Couture branding</li>
                  <li>• Default inventory and pricing</li>
                  <li>• Return policy information</li>
                  <li>• Visibility and discount settings</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium text-sm mb-2">API Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Ensure you have set up the{" "}
                <code className="bg-gray-100 px-1 rounded">
                  NEXT_PUBLIC_OPENAI_API_KEY
                </code>{" "}
                environment variable with your OpenAI API key to enable AI image
                analysis functionality.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIImageRecognition;
