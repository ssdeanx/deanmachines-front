'use client';

import { Metadata } from "next";
import Link from "next/link";
import {
  BarChart,
  FileText,
  Database,
  Filter,
  LineChart,
  Network,
  ArrowRight,
  CheckCircle2,
  Search,
  Zap,
  Newspaper,
  FileCode,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IconWrapper } from "@/components/common/IconWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type LucideIcon } from "lucide-react";

export const metadata = {
  title: `Data Processing Solutions - ${siteConfig.name}`,
  description: "Extract valuable insights from structured and unstructured data with advanced AI processing.",
} satisfies Metadata;

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <IconWrapper icon={icon} size="md" className="text-primary" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function BenefitItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-primary">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function DataProcessingPage() {
  const features = [
    {
      title: "Intelligent Data Extraction",
      description: "Automatically extract structured data from documents, images, and unstructured sources",
      icon: FileText,
    },
    {
      title: "Advanced Analytics",
      description: "Discover patterns, correlations, and anomalies with machine learning algorithms",
      icon: BarChart,
    },
    {
      title: "Data Integration",
      description: "Seamlessly combine and normalize data from multiple sources into a unified format",
      icon: Database,
    },
    {
      title: "Natural Language Processing",
      description: "Extract meaning, sentiment, and key information from text-based content",
      icon: FileCode,
    },
    {
      title: "Real-time Processing",
      description: "Process and analyze data streams in real-time for immediate insights and actions",
      icon: Zap,
    },
    {
      title: "Data Visualization",
      description: "Transform complex data sets into intuitive visual reports and dashboards",
      icon: LineChart,
    },
  ];

  const dataTypes = [
    {
      title: "Structured Data",
      examples: ["Database Records", "Spreadsheets", "API Responses", "CSV Files"],
      icon: Database,
    },
    {
      title: "Unstructured Data",
      examples: ["Documents", "Emails", "Social Media", "Audio/Video"],
      icon: FileText,
    },
    {
      title: "Semi-structured Data",
      examples: ["JSON/XML Files", "Web Pages", "Log Files", "Survey Responses"],
      icon: FileCode,
    },
  ];

  return (
    <div className="container relative">
      {/* Hero Section */}
      <section className="mx-auto max-w-5xl py-12 text-center md:py-20">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
          AI Data Processing
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-3xl mx-auto">
          Transform raw data into actionable intelligence with our advanced AI processing solutions
          that extract insights from any data source
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button asChild size="lg">
            <Link href="/contact">Request Demo</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/docs/data-processing">View Documentation</Link>
          </Button>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features */}
      <section className="py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center">Core Capabilities</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900 rounded-lg p-8">
        <h2 className="text-3xl font-bold tracking-tighter mb-10 text-center">Data Processing at Scale</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard value="90%" label="Reduction in manual data entry tasks" />
          <StatCard value="10TB+" label="Data processed daily across our platform" />
          <StatCard value="99.9%" label="Processing accuracy for structured data" />
        </div>
      </section>

      {/* Data Types Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-10 text-center">Handle Any Data Type</h2>

        <div className="grid gap-8 md:grid-cols-3">
          {dataTypes.map((type) => (
            <Card key={type.title} className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-16 h-16 flex items-center justify-center">
                  <IconWrapper icon={type.icon} size="lg" className="text-primary" />
                </div>
                <CardTitle>{type.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  {type.examples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Use Cases Tabs */}
      <section className="py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center">Data Processing Solutions</h2>

        <Tabs defaultValue="extraction" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="extraction">Data Extraction</TabsTrigger>
            <TabsTrigger value="analysis">Data Analysis</TabsTrigger>
            <TabsTrigger value="enrichment">Data Enrichment</TabsTrigger>
          </TabsList>
          <TabsContent value="extraction">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Automated Data Extraction</h3>
                <p className="text-muted-foreground mb-6">
                  Our AI-powered extraction technology identifies and captures relevant information from documents,
                  images, and unstructured sources with minimal human intervention.
                </p>
                <ul className="space-y-3">
                  <BenefitItem>Intelligent OCR with context-aware text recognition</BenefitItem>
                  <BenefitItem>Extract data from invoices, receipts, forms, and reports</BenefitItem>
                  <BenefitItem>Identify and categorize entities, relationships, and attributes</BenefitItem>
                  <BenefitItem>Validate extracted data against predefined business rules</BenefitItem>
                </ul>
                <Button asChild className="mt-6">
                  <Link href="/demos/data-extraction">
                    <span className="flex items-center gap-2">
                      See Extraction Demo
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Button>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 h-[350px]">
                {/* Data extraction visualization placeholder */}
                <div className="h-full flex items-center justify-center text-center p-4">
                  <p className="text-muted-foreground">Data Extraction Visual</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="analysis">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 h-[350px]">
                {/* Data analysis visualization placeholder */}
                <div className="h-full flex items-center justify-center text-center p-4">
                  <p className="text-muted-foreground">Data Analysis Dashboard</p>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Advanced Analytics Engine</h3>
                <p className="text-muted-foreground mb-6">
                  Transform your raw data into actionable insights with our AI-powered analytics
                  that identifies patterns, trends, and correlations hidden in your data.
                </p>
                <ul className="space-y-3">
                  <BenefitItem>Predictive analytics to forecast future trends</BenefitItem>
                  <BenefitItem>Anomaly detection to identify unusual patterns</BenefitItem>
                  <BenefitItem>Clustering and segmentation for targeted insights</BenefitItem>
                  <BenefitItem>Custom metrics and KPIs tailored to your business</BenefitItem>
                </ul>
                <Button asChild className="mt-6">
                  <Link href="/case-studies/data-analysis">
                    <span className="flex items-center gap-2">
                      View Analysis Case Studies
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="enrichment">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Intelligent Data Enrichment</h3>
                <p className="text-muted-foreground mb-6">
                  Enhance your existing data with additional context, attributes, and insights
                  from our proprietary databases and public data sources.
                </p>
                <ul className="space-y-3">
                  <BenefitItem>Entity resolution and deduplication across databases</BenefitItem>
                  <BenefitItem>Augment records with additional attributes and metadata</BenefitItem>
                  <BenefitItem>Sentiment analysis for customer feedback and social media</BenefitItem>
                  <BenefitItem>Geospatial enrichment for location-based insights</BenefitItem>
                </ul>
                <Button asChild className="mt-6">
                  <Link href="/demos/data-enrichment">
                    <span className="flex items-center gap-2">
                      Explore Enrichment Capabilities
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Button>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 h-[350px]">
                {/* Data enrichment visualization placeholder */}
                <div className="h-full flex items-center justify-center text-center p-4">
                  <p className="text-muted-foreground">Data Enrichment Diagram</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Process Steps */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900 rounded-lg p-8">
        <h2 className="text-3xl font-bold tracking-tighter mb-10 text-center">Our Data Processing Methodology</h2>

        <div className="relative">
          {/* Desktop connector line */}
          <div className="absolute top-12 left-0 w-full h-0.5 bg-primary hidden md:block" />

          <div className="grid gap-8 md:grid-cols-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4 mx-auto md:mb-8 z-10 relative">1</div>
              <Card className="text-center h-full">
                <CardHeader>
                  <CardTitle>Data Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Secure integration with your existing data sources and systems
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4 mx-auto md:mb-8 z-10 relative">2</div>
              <Card className="text-center h-full">
                <CardHeader>
                  <CardTitle>Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    AI-powered extraction, transformation, and normalization
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4 mx-auto md:mb-8 z-10 relative">3</div>
              <Card className="text-center h-full">
                <CardHeader>
                  <CardTitle>Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Advanced analytics to derive insights and identify patterns
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4 mx-auto md:mb-8 z-10 relative">4</div>
              <Card className="text-center h-full">
                <CardHeader>
                  <CardTitle>Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Insights delivered through dashboards, APIs, or integrated workflows
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-10 text-center">Industries We Serve</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: "Financial Services", icon: "💰" },
            { name: "Healthcare", icon: "🏥" },
            { name: "Retail", icon: "🛍️" },
            { name: "Manufacturing", icon: "🏭" },
            { name: "Legal Services", icon: "⚖️" },
            { name: "Government", icon: "🏛️" }
          ].map((industry) => (
            <Card key={industry.name} className="flex items-center gap-4 p-4">
              <div className="text-2xl">{industry.icon}</div>
              <p className="font-medium">{industry.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="my-12">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to unlock insights from your data?</CardTitle>
            <CardDescription className="text-primary-foreground/90">
              Learn how our AI data processing solutions can transform your raw data into actionable intelligence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">Schedule a Demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/pricing/data-processing">View Pricing Options</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
