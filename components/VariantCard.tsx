'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Eye, Share2, BarChart3, TrendingUp } from 'lucide-react';
import { formatNumber } from '../lib/utils';

interface AdVariant {
  id: string;
  headline: string;
  body: string;
  cta: string;
  angle: string;
  imageUrl: string;
  performance?: {
    views: number;
    engagement: number;
    conversions: number;
    ctr: number;
  };
}

interface VariantCardProps {
  variant: AdVariant;
  isAnalyzed?: boolean;
  onDeploy?: (variantId: string) => void;
  onAnalyze?: (variantId: string) => void;
}

export default function VariantCard({ 
  variant, 
  isAnalyzed = false, 
  onDeploy, 
  onAnalyze 
}: VariantCardProps) {
  const { performance } = variant;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{variant.angle}</CardTitle>
          <div className="flex items-center gap-2">
            {isAnalyzed && performance && (
              <div className="flex items-center gap-1 text-xs text-green-400">
                <TrendingUp className="w-3 h-3" />
                {performance.ctr.toFixed(1)}%
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Ad Preview */}
        <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg overflow-hidden">
          {variant.imageUrl ? (
            <img 
              src={variant.imageUrl} 
              alt="Ad variant" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Eye className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Ad Copy */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm leading-tight">{variant.headline}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{variant.body}</p>
          <Button size="sm" className="text-xs h-7 px-3">{variant.cta}</Button>
        </div>

        {/* Performance Metrics */}
        {isAnalyzed && performance && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Views</div>
              <div className="text-sm font-medium">{formatNumber(performance.views)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Engagement</div>
              <div className="text-sm font-medium">{formatNumber(performance.engagement)}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {!isAnalyzed ? (
            <Button 
              size="sm" 
              className="flex-1 text-xs h-8"
              onClick={() => onDeploy?.(variant.id)}
            >
              <Share2 className="w-3 h-3 mr-1" />
              Deploy
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs h-8"
              onClick={() => onAnalyze?.(variant.id)}
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Analyze
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
