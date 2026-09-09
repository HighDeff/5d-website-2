/**
 * Collection Engagement Display Component
 * Shows real-time likes and views based on actual database clicks and probability calculations
 */

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { AdvancedEngagementCalculator } from "@/services/AdvancedEngagementCalculator";

interface CollectionEngagementDisplayProps {
  collectionId: string;
  collectionName: string;
  productIds: string[];
  showDetails?: boolean;
  className?: string;
}

const CollectionEngagementDisplay: React.FC<
  CollectionEngagementDisplayProps
> = ({
  collectionId,
  collectionName,
  productIds,
  showDetails = false,
  className = "",
}) => {
  const [engagement, setEngagement] = useState({
    totalLikes: 0,
    totalViews: 0,
    averageConfidence: 0,
    isLoading: true,
  });
  const [showValidation, setShowValidation] = useState(false);
  const [validationResults, setValidationResults] = useState<any[]>([]);

  useEffect(() => {
    loadEngagementData();

    // Refresh every 30 seconds
    const interval = setInterval(loadEngagementData, 30000);

    return () => clearInterval(interval);
  }, [collectionId, productIds]);

  const loadEngagementData = async () => {
    try {
      setEngagement((prev) => ({ ...prev, isLoading: true }));

      let totalLikes = 0;
      let totalViews = 0;
      let totalConfidence = 0;
      const results: any[] = [];

      // Calculate engagement for each product in collection
      for (const productId of productIds) {
        try {
          const result = await AdvancedEngagementCalculator.calculateEngagement(
            productId,
            collectionId,
          );

          totalLikes += result.calculatedLikes;
          totalViews += result.calculatedViews;
          totalConfidence += result.probabilityConfidence;

          results.push({
            productId,
            likes: result.calculatedLikes,
            views: result.calculatedViews,
            confidence: result.probabilityConfidence,
            errors: result.validationErrors,
            centralHubVerified: result.centralHubVerified,
            coinFlips: result.coinFlipResults.length,
          });
        } catch (error) {
          console.error(
            `Error calculating engagement for ${productId}:`,
            error,
          );
          results.push({
            productId,
            likes: 0,
            views: 0,
            confidence: 0,
            errors: [`Calculation error: ${error.message}`],
            centralHubVerified: false,
            coinFlips: 0,
          });
        }
      }

      const averageConfidence =
        productIds.length > 0 ? totalConfidence / productIds.length : 0;

      setEngagement({
        totalLikes,
        totalViews,
        averageConfidence,
        isLoading: false,
      });

      setValidationResults(results);
    } catch (error) {
      console.error("Error loading engagement data:", error);
      setEngagement({
        totalLikes: 0,
        totalViews: 0,
        averageConfidence: 0,
        isLoading: false,
      });
    }
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBadgeVariant = (
    confidence: number,
  ): "default" | "secondary" | "destructive" => {
    if (confidence >= 80) return "default";
    if (confidence >= 60) return "secondary";
    return "destructive";
  };

  if (engagement.isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-pulse flex items-center space-x-2">
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main engagement display */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Heart className="w-4 h-4 text-pink-500" />
          <span className="font-medium text-pink-600">
            {engagement.totalLikes.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <Eye className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-blue-600">
            {engagement.totalViews.toLocaleString()}
          </span>
        </div>

        <Badge
          variant={getConfidenceBadgeVariant(engagement.averageConfidence)}
          className="text-xs"
        >
          {engagement.averageConfidence.toFixed(1)}% confidence
        </Badge>

        {showDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowValidation(!showValidation)}
            className="text-xs"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Details
          </Button>
        )}
      </div>

      {/* Detailed validation results */}
      {showValidation && showDetails && (
        <div className="bg-gray-50 border rounded p-3 text-xs space-y-2">
          <div className="font-medium text-gray-800">
            Validation Results for {collectionName}:
          </div>

          <div className="space-y-1">
            {validationResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">Product {index + 1}:</span>
                <div className="flex items-center space-x-2">
                  <span>
                    {result.likes} likes, {result.views} views
                  </span>
                  {result.centralHubVerified ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span className={getConfidenceColor(result.confidence)}>
                    {result.confidence.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Error summary */}
          {validationResults.some((r) => r.errors.length > 0) && (
            <div className="border-t pt-2">
              <div className="font-medium text-red-600 mb-1">
                Validation Issues:
              </div>
              {validationResults
                .filter((r) => r.errors.length > 0)
                .map((result, index) => (
                  <div key={index} className="text-red-500">
                    • {result.errors[0]}
                  </div>
                ))}
            </div>
          )}

          {/* Coin flip summary */}
          <div className="border-t pt-2">
            <div className="font-medium text-purple-600 mb-1">
              Probability Analysis:
            </div>
            <div className="text-purple-600">
              Total coin flips:{" "}
              {validationResults.reduce((sum, r) => sum + r.coinFlips, 0)}
            </div>
            <div className="text-purple-600">
              Central hub verified:{" "}
              {validationResults.filter((r) => r.centralHubVerified).length}/
              {validationResults.length}
            </div>
          </div>
        </div>
      )}

      {/* Real-time indicator */}
      <div className="flex items-center text-xs text-gray-500">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
        Live data • Based on actual clicks
      </div>
    </div>
  );
};

export default CollectionEngagementDisplay;
