'use client';

import { Metadata } from "next";
import Link from "next/link";
import {
  Headset,
  MessageSquare,
  Users,
  BarChart3,
  Clock,
  Bot,
  ArrowRight,
  CheckCircle2,
  Languages,
  Puzzle,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IconWrapper } from "@/components/common/IconWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: `Customer Service AI Solutions - ${siteConfig.name}`,
  description: "Transform your customer experience with intelligent automation and personalized service.",
} satisfies Metadata;

import type { LucideIcon } from "lucide-react";

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

function Metric({ value, label, description }: { value: string; label: string; description: string }) {
  return (
    <Card className="text-center h-full">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-primary">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium">{label}</h3>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
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

export default function CustomerServicePage() {
  const features = [
    {
      title: "AI-Powered Chatbots",
      description: "Intelligent virtual assistants that handle customer inquiries 24/7 with natural language understanding",
      icon: MessageSquare,
    },
    {
      title: "Customer Analytics",
      description: "Deep insights into customer behavior and sentiment to personalize interactions and improve satisfaction",
      icon: BarChart3,
    },
    {
      title: "Omnichannel Support",
      description: "Seamless customer experience across web, mobile, social media, email, and phone channels",
      icon: Users,
    },
    {
      title: "Response Automation",
      description: "Intelligent response templates and suggestions that help human agents respond faster and more accurately",
      icon: Bot,
    },
    {
      title: "Multilingual Support",
      description: "Real-time translation and language processing to support global customer bases",
      icon: Languages,
    },
    {
      title: "Integration Ecosystem",
      description: "Connect with existing CRMs, helpdesk solutions, and customer data platforms",
      icon: Puzzle,
    },
  ];

  return (
    <div className="container relative">
      {/* Hero Section */}
      <section className="mx-auto max-w-5xl py-12 text-center md:py-20">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
          Customer Service AI
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-3xl mx-auto">
          Transform your customer support with AI-powered automation that enhances
          customer satisfaction while reducing operational costs
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button asChild size="lg">
            <Link href="/contact">Request Demo</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/docs/customer-service">View Documentation</Link>
          </Button>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features */}
      <section className="py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center">Key Features</h2>
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
        <h2 className="text-3xl font-bold tracking-tighter mb-10 text-center">Impact on Customer Service</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Metric
            value="70%"
            label="Faster Resolution"
            description="Average reduction in time to resolution for customer inquiries"
          />
          <Metric
            value="24/7"
            label="Support Availability"
            description="Continuous customer support without increasing staff costs"
          />
          <Metric
            value="85%"
            label="Customer Satisfaction"
            description="Average CSAT score for AI-assisted customer interactions"
          />
        </div>
      </section>

      {/* Solutions Tabs */}
      <section className="py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center">Customer Service Solutions</h2>

        <Tabs defaultValue="chatbots" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="chatbots">AI Chatbots</TabsTrigger>
            <TabsTrigger value="agent-assist">Agent Assistance</TabsTrigger>
            <TabsTrigger value="analytics">Customer Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="chatbots">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Intelligent Conversational AI</h3>
                <p className="text-muted-foreground mb-6">
                  Our AI chatbots understand natural language, maintain context through conversations,
                  and can handle complex customer inquiries without human intervention.
                </p>
                <ul className="space-y-3">
                  <BenefitItem>Neural language models trained on millions of customer service interactions</BenefitItem>
                  <BenefitItem>Seamless handoff to human agents for complex cases</BenefitItem>
                  <BenefitItem>Personalized responses based on customer history</BenefitItem>
                  <BenefitItem>Proactive issue resolution before customers report problems</BenefitItem>
                </ul>
                <Button asChild className="mt-6">
                  <Link href="/demos/chatbot">Try Our Demo Chatbot</Link>
                </Button>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 h-[350px]">
                {/* Chatbot interaction demo placeholder */}
                <div className="h-full flex items-center justify-center text-center p-4">
                  <p className="text-muted-foreground">Interactive Chatbot Demo Visual</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="agent-assist">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 h-[350px]">
                {/* Agent interface demo placeholder */}
                <div className="h-full flex items-center justify-center text-center p-4">
                  <p className="text-muted-foreground">Agent Dashboard Visual</p>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">AI Agent Augmentation</h3>
                <p className="text-muted-foreground mb-6">
                  Empower your human support team with AI tools that help them deliver faster,
                  more accurate responses while maintaining the human touch.
                </p>
                <ul className="space-y-3">
                  <BenefitItem>Real-time response suggestions based on customer inquiries</BenefitItem>
                  <BenefitItem>Automatic retrieval of relevant customer data and history</BenefitItem>
                  <BenefitItem>Sentiment analysis to guide agent tone and approach</BenefitItem>
                  <BenefitItem>Performance analytics to identify training opportunities</BenefitItem>
                </ul>
                <Button asChild className="mt-6">
                  <Link href="/case-studies/agent-assist">Read Agent Success Stories</Link>
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Customer Insights Engine</h3>
                <p className="text-muted-foreground mb-6">
                  Turn customer interactions into actionable insights with our advanced analytics platform
                  that identifies patterns, predicts issues, and guides service improvements.
                </p>
                <ul className="space-y-3">
                  <BenefitItem>Identify common customer pain points and satisfaction drivers</BenefitItem>
                  <BenefitItem>Track sentiment trends across products, regions, and time periods</BenefitItem>
                  <BenefitItem>Predict customer churn risk and prioritize retention efforts</BenefitItem>
                  <BenefitItem>Measure the impact of service changes on customer satisfaction</BenefitItem>
                </ul>
                <Button asChild className="mt-6">
                  <Link href="/demos/analytics">View Analytics Demo</Link>
                </Button>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 h-[350px]">
                {/* Analytics dashboard placeholder */}
                <div className="h-full flex items-center justify-center text-center p-4">
                  <p className="text-muted-foreground">Analytics Dashboard Visual</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Implementation Process */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900 rounded-lg p-8">
        <h2 className="text-3xl font-bold tracking-tighter mb-10 text-center">Implementation Process</h2>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">1</div>
              <CardTitle>Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We analyze your current customer service infrastructure, challenges, and goals
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">2</div>
              <CardTitle>Custom Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our team designs and configures an AI solution tailored to your specific needs
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">3</div>
              <CardTitle>Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Seamlessly connect with existing systems and train the AI on your specific data
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">4</div>
              <CardTitle>Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Continuous improvement based on performance metrics and customer feedback
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-10 text-center">What Our Clients Say</h2>

        <Card className="bg-slate-50 dark:bg-slate-900">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto"></div>
                <div className="text-center mt-4">
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Customer Experience Director</p>
                  <p className="text-sm text-muted-foreground">Global Retail Inc.</p>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="italic text-lg mb-6">
                  "Implementing DeanMachines' customer service AI has completely transformed our support operations.
                  We've reduced response times by 60% while improving customer satisfaction scores to record highs.
                  The AI's ability to learn from each interaction means it gets better every day."
                </p>
                <div className="flex items-center">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="my-12">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to transform your customer service?</CardTitle>
            <CardDescription className="text-primary-foreground/90">
              Join industry leaders who are delivering exceptional customer experiences with our AI solutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">Schedule a Demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/pricing/customer-service">View Pricing Options</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
