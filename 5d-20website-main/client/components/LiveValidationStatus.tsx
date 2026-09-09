/**
 * Live Validation Status Display Component
 * Shows real-time page validation status and allows manual validation
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertTriangle,
  Eye,
  RefreshCw,
  Activity,
  Database,
  Bot,
} from "lucide-react";
import { LivePageValidationAI } from "@/services/LivePageValidationAI";

interface LiveValidationStatusProps {
  showDetails?: boolean;
  className?: string;
}

const LiveValidationStatus: React.FC<LiveValidationStatusProps> = ({
  showDetails = true,
  className = "",
}) => {
  const [validationStatus, setValidationStatus] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    updateStatus();

    // Update status every 15 seconds
    const interval = setInterval(updateStatus, 15000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = () => {
    const status = LivePageValidationAI.getValidationStatus();
    const result = LivePageValidationAI.getLastValidationResult();

    setValidationStatus(status);
    setValidationResult(result);
  };

  const handleForceValidation = async () => {
    setIsValidating(true);
    try {
      const result = await LivePageValidationAI.forceValidation();
      setValidationResult(result);
      updateStatus();
    } catch (error) {
      console.error("Error forcing validation:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusColor = () => {
    if (!validationResult) return "text-gray-500";
    if (validationResult.errors.length > 0) return "text-red-500";
    if (validationResult.corrections.length > 0) return "text-yellow-500";
    return "text-green-500";
  };

  const getStatusIcon = () => {
    if (!validationResult) return <Activity className="w-4 h-4" />;
    if (validationResult.errors.length > 0)
      return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (!validationResult) return "No validation data";
    if (validationResult.errors.length > 0) return "Issues detected";
    if (validationResult.corrections.length > 0) return "Corrections applied";
    return "All valid";
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Bot className="w-4 h-4 mr-2 text-purple-600" />
          Live Page AI Validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Status Overview */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={getStatusColor()}>{getStatusIcon()}</div>
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleForceValidation}
            disabled={isValidating || validationStatus?.isValidating}
            className="text-xs"
          >
            {isValidating || validationStatus?.isValidating ? (
              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Eye className="w-3 h-3 mr-1" />
            )}
            Validate
          </Button>
        </div>

        {/* Quick Stats */}
        {validationResult && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-semibold">{validationResult.totalCards}</div>
              <div className="text-gray-600">Cards</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-semibold text-red-600">
                {validationResult.errors.length}
              </div>
              <div className="text-gray-600">Errors</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-semibold text-green-600">
                {validationResult.corrections.length}
              </div>
              <div className="text-gray-600">Fixed</div>
            </div>
          </div>
        )}

        {/* Detailed Status */}
        {showDetails && validationResult && (
          <div className="space-y-2">
            {/* Recent Errors */}
            {validationResult.errors.length > 0 && (
              <div className="text-xs">
                <div className="font-medium text-red-600 mb-1">
                  Recent Issues:
                </div>
                {validationResult.errors
                  .slice(0, 3)
                  .map((error: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-1 bg-red-50 rounded"
                    >
                      <span className="text-red-700">{error.errorType}</span>
                      <Badge variant="destructive" className="text-xs">
                        {error.severity}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}

            {/* Recent Corrections */}
            {validationResult.corrections.length > 0 && (
              <div className="text-xs">
                <div className="font-medium text-green-600 mb-1">
                  Auto-Fixed:
                </div>
                {validationResult.corrections
                  .slice(0, 3)
                  .map((correction: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-1 bg-green-50 rounded"
                    >
                      <span className="text-green-700">{correction.field}</span>
                      <Badge variant="secondary" className="text-xs">
                        {correction.oldValue} → {correction.newValue}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}

            {/* Database Mismatches */}
            {validationResult.databaseMismatches.length > 0 && (
              <div className="text-xs">
                <div className="font-medium text-yellow-600 mb-1">
                  DB Mismatches:
                </div>
                {validationResult.databaseMismatches
                  .slice(0, 2)
                  .map((mismatch: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 p-1 bg-yellow-50 rounded"
                    >
                      <Database className="w-3 h-3 text-yellow-600" />
                      <span className="text-yellow-700">{mismatch.field}</span>
                      <span className="text-xs">
                        ({mismatch.pageValue} vs {mismatch.databaseValue})
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Last Validation Time */}
        {validationStatus?.lastValidation && (
          <div className="text-xs text-gray-500 border-t pt-2">
            Last check:{" "}
            {new Date(validationStatus.lastValidation).toLocaleTimeString()}
          </div>
        )}

        {/* Live Indicator */}
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
          Live monitoring active
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveValidationStatus;
