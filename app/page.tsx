'use client';

import React, { useState } from 'react';
import AppShell from '../components/AppShell';
import ImageUploader from '../components/ImageUploader';
import VariantCard from '../components/VariantCard';
import ActionButton from '../components/ActionButton';
import AgentChat from '../components/AgentChat';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Share2, 
  Sparkles,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../lib/utils';
import { generateAdCopy } from '../lib/openai';

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

interface Campaign {
  id: string;
  productName: string;
  originalImage: string;
  variants: AdVariant[];
  status: 'draft' | 'generating' | 'ready' | 'deployed';
}

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('campaigns');
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock performance data
  const mockPerformance = {
    totalRevenue: 185335,
    totalViews: 1255609,
    totalEngagement: 89542,
    activeCampaigns: 12
  };

  // Mock deployed variants with performance data
  const mockDeployedVariants: AdVariant[] = [
    {
      id: '1',
      headline: 'Transform Your Style',
      body: 'Discover the perfect look that matches your personality. Shop now!',
      cta: 'Shop Now',
      angle: 'Lifestyle',
      imageUrl: '/api/placeholder/300/300',
      performance: {
        views: 45230,
        engagement: 3420,
        conversions: 89,
        ctr: 7.6
      }
    },
    {
      id: '2',
      headline: 'Limited Time Offer',
      body: 'Get 30% off premium styles. Only 24 hours left!',
      cta: 'Claim Offer',
      angle: 'Urgency',
      imageUrl: '/api/placeholder/300/300',
      performance: {
        views: 38720,
        engagement: 2890,
        conversions: 156,
        ctr: 4.0
      }
    },
    {
      id: '3',
      headline: '10k+ Happy Customers',
      body: 'Join thousands who already love our products. See what they say!',
      cta: 'Read Reviews',
      angle: 'Social Proof',
      imageUrl: '/api/placeholder/300/300',
      performance: {
        views: 29440,
        engagement: 4230,
        conversions: 67,
        ctr: 14.4
      }
    }
  ];

  const handleImageUpload = async (file: File, preview: string) => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      productName: file.name.split('.')[0],
      originalImage: preview,
      variants: [],
      status: 'draft'
    };
    
    setCurrentCampaign(newCampaign);
  };

  const generateVariants = async () => {
    if (!currentCampaign) return;

    setIsGenerating(true);
    setCurrentCampaign(prev => prev ? { ...prev, status: 'generating' } : null);

    try {
      // Generate ad copy variations
      const adCopyVariants = await generateAdCopy(currentCampaign.productName, currentCampaign.originalImage);
      
      const variants: AdVariant[] = adCopyVariants?.map((copy: any, index: number) => ({
        id: `variant-${index}`,
        headline: copy.headline,
        body: copy.body,
        cta: copy.cta,
        angle: copy.angle,
        imageUrl: currentCampaign.originalImage, // In production, this would be AI-generated variants
      })) || [];

      setCurrentCampaign(prev => prev ? {
        ...prev,
        variants,
        status: 'ready'
      } : null);
    } catch (error) {
      console.error('Error generating variants:', error);
      // Fallback to mock data
      const mockVariants: AdVariant[] = [
        {
          id: 'mock-1',
          headline: 'Revolutionize Your Look',
          body: 'Step into confidence with our premium collection. Style that speaks volumes.',
          cta: 'Shop Now',
          angle: 'Emotional Appeal',
          imageUrl: currentCampaign.originalImage,
        },
        {
          id: 'mock-2',
          headline: 'Limited Stock Alert',
          body: 'Only 5 left! Don\'t miss out on this bestseller.',
          cta: 'Buy Now',
          angle: 'Urgency',
          imageUrl: currentCampaign.originalImage,
        },
        {
          id: 'mock-3',
          headline: 'Loved by 50k+',
          body: 'Join thousands of satisfied customers. See why everyone\'s talking!',
          cta: 'Join Now',
          angle: 'Social Proof',
          imageUrl: currentCampaign.originalImage,
        }
      ];

      setCurrentCampaign(prev => prev ? {
        ...prev,
        variants: mockVariants,
        status: 'ready'
      } : null);
    } finally {
      setIsGenerating(false);
    }
  };

  const deployVariant = (variantId: string) => {
    console.log('Deploying variant:', variantId);
    // In production, this would deploy to social media platforms
    alert('Variant deployed to test pages! Performance data will be available soon.');
  };

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">AdSpark AI</h1>
        <p className="text-muted-foreground">
          Create compelling ad campaigns and grow revenue on autopilot
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(mockPerformance.totalRevenue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-primary">
                  {formatNumber(mockPerformance.totalViews)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold text-accent">
                  {formatNumber(mockPerformance.totalEngagement)}
                </p>
              </div>
              <Users className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{mockPerformance.activeCampaigns}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Campaign Creation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Campaign */}
          {!currentCampaign ? (
            <Card>
              <CardHeader>
                <CardTitle>Create New Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader onImageUpload={handleImageUpload} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Campaign: {currentCampaign.productName}
                  <span className="text-sm font-normal text-muted-foreground capitalize">
                    {currentCampaign.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentCampaign.status === 'draft' && (
                  <ActionButton
                    onClick={generateVariants}
                    icon={<Sparkles className="w-4 h-4" />}
                    size="lg"
                    className="w-full"
                  >
                    Generate AI Variants
                  </ActionButton>
                )}

                {currentCampaign.status === 'generating' && (
                  <ActionButton
                    loading
                    size="lg"
                    className="w-full"
                  >
                    Generating Variants...
                  </ActionButton>
                )}

                {currentCampaign.variants.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentCampaign.variants.map((variant) => (
                      <VariantCard
                        key={variant.id}
                        variant={variant}
                        onDeploy={deployVariant}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Performance Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Live Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockDeployedVariants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    isAnalyzed
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - AI Agent */}
        <div>
          <AgentChat campaignData={currentCampaign} />
        </div>
      </div>
    </div>
  );

  return (
    <AppShell 
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {activeSection === 'campaigns' && renderDashboard()}
      {activeSection !== 'campaigns' && (
        <div className="p-6 flex items-center justify-center h-full">
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Feature Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                This section is under development. Stay tuned for more amazing features!
              </p>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
