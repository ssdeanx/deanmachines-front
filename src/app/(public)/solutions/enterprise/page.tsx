'use client';

import { Metadata } from "next";
import Link from "next/link";
import {
  Building,
  Workflow,
  Database,
  Network,
  ArrowRight,
  CheckCircle2,
  Layers,
  Shield,
  LineChart,
  Users,
  BrainCircuit,
  CloudCog,
  LucideIcon,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IconWrapper } from "@/components/common/IconWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: `Enterprise AI Solutions - ${siteConfig.name}`,
  description: "Comprehensive AI solutions tailored for enterprise-scale operations across departments.",
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

function UseCaseCard({ title, description, icon }: { title: string; description: string; icon: LucideIcon }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="mb-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <IconWrapper icon={icon} size="md" className="text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export default function EnterpriseAIPage() {
  const features = [
    {
      title: "Enterprise Integration",
      description: "Seamlessly connect our AI platform with your existing enterprise systems and data sources",
      icon: Network,
    },
    {
      title: "Process Automation",
      description: "Identify and automate repetitive business processes to increase efficiency and reduce costs",
      icon: Workflow,
    },
    {
      title: "Data Intelligence",
      description: "Transform your enterprise data into actionable insights through advanced analytics",
      icon: Database,
    },
    {
      title: "Scalable Architecture",
      description: "Our platform scales with your organization, from departmental deployments to enterprise-wide solutions",
      icon: Layers,
    },
    {
      title: "Security & Compliance",
      description: "Enterprise-grade security with compliance controls for regulated industries",
      icon: Shield,
    },
    {
      title: "Performance Analytics",
      description: "Comprehensive dashboards and reporting to track ROI and operational improvements",
      icon: LineChart,
    },
  ];

  const useCases = [
    {
      title: "Finance & Operations",
      description: "Optimize financial forecasting, automate accounts processing, and enhance operational efficiency",
      icon: Building,
    },
    {
      title: "Human Resources",
      description: "Streamline recruitment, automate employee onboarding, and enhance workforce analytics",
      icon: Users,
    },
    {
      title: "IT Operations",
      description: "Predict system failures, automate incident response, and optimize infrastructure management",
      icon: CloudCog,
    },
    {
      title: "Strategic Decision-Making",
      description: "Enhance executive decision-making with AI-powered market analysis and competitive intelligence",
      icon: BrainCircuit,
    },
  ];

  return (
    <div className="container relative">
      {/* Hero Section */}
      <section className="mx-auto max-w-5xl py-12 text-center md:py-20">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
          Enterprise AI Solutions
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-3xl mx-auto">
          Comprehensive AI technology designed to transform your enterprise operations,
          enhance decision-making, and deliver measurable business value
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button asChild size="lg">
            <Link href="/contact">Request Enterprise Demo</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/docs/enterprise">Enterprise Documentation</Link>
          </Button>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features */}
      <section className="py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center">Enterprise Capabilities</h2>
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

      {/* Platform Overview */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900 rounded-lg p-8">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Enterprise Platform</h2>
            <p className="text-muted-foreground mb-8">
              Our enterprise AI platform offers a comprehensive suite of tools and capabilities
              designed to address the unique challenges and requirements of large organizations.
            </p>
            <ul className="space-y-4">
              <BenefitItem>Modular architecture that adapts to your specific business needs</BenefitItem>
              <BenefitItem>Hybrid deployment options: cloud, on-premise, or hybrid</BenefitItem>
              <BenefitItem>Enterprise-grade security with role-based access control</BenefitItem>
              <BenefitItem>Advanced integration capabilities with existing business systems</BenefitItem>
              <BenefitItem>Scalable infrastructure to support growing data and user needs</BenefitItem>
            </ul>
            <Button asChild className="mt-8">
              <Link href="/platform-overview">
                <span className="flex items-center gap-2">
                  Platform Architecture
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Button>
          </div>
          <div className="bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center min-h-[300px]">
            {/* Platform architecture diagram placeholder */}
            <p className="text-muted-foreground">Platform Architecture Diagram</p>
          </div>
        </div>
      </section>

      {/* Enterprise Use Cases */}
      <section className="py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-10 text-center">Enterprise Use Cases</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase) => (
            <UseCaseCard
              key={useCase.title}
              title={useCase.title}
              description={useCase.description}
              icon={useCase.icon}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/case-studies/enterprise">
              <span className="flex items-center gap-2">
                View Enterprise Case Studies
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </Button>
        </div>
      </section>

      {/* Implementation Approach */}
      <section className="py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-10 text-center">Enterprise Implementation</h2>

        <Tabs defaultValue="assessment" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="design">Solution Design</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="support">Ongoing Support</TabsTrigger>
          </TabsList>
          <TabsContent value="assessment" className="mt-6 p-6 border rounded-lg">
            <h3 className="text-xl font-bold mb-4">Enterprise Assessment</h3>
            <p className="mb-4">
              Our enterprise team works with your stakeholders to understand your current
              systems, processes, and objectives to identify optimal AI implementation opportunities.
            </p>
            <ul className="space-y-2">
              <li>• Complete systems and data infrastructure audit</li>
              <li>• Business process assessment and optimization opportunities</li>
              <li>• ROI projections and implementation roadmap</li>
              <li>• Stakeholder interviews and requirements gathering</li>
            </ul>
          </TabsContent>
          <TabsContent value="design" className="mt-6 p-6 border rounded-lg">
            <h3 className="text-xl font-bold mb-4">Custom Solution Design</h3>
            <p className="mb-4">
              Based on our assessment findings, we design a comprehensive AI solution
              tailored to your specific enterprise requirements and objectives.
            </p>
            <ul className="space-y-2">
              <li>• Customized AI models trained on your specific data</li>
              <li>• Integration architecture with existing enterprise systems</li>
              <li>• Security and compliance controls implementation</li>
              <li>• User experience design for different stakeholder groups</li>
            </ul>
          </TabsContent>
          <TabsContent value="deployment" className="mt-6 p-6 border rounded-lg">
            <h3 className="text-xl font-bold mb-4">Enterprise Deployment</h3>
            <p className="mb-4">
              Our experienced deployment team ensures a smooth implementation with
              minimal disruption to your ongoing business operations.
            </p>
            <ul className="space-y-2">
              <li>• Phased deployment approach to minimize business risk</li>
              <li>• Comprehensive testing in staging environments</li>
              <li>• User training and change management support</li>
              <li>• Performance monitoring and optimization</li>
            </ul>
          </TabsContent>
          <TabsContent value="support" className="mt-6 p-6 border rounded-lg">
            <h3 className="text-xl font-bold mb-4">Enterprise Support</h3>
            <p className="mb-4">
              Our enterprise support team provides ongoing assistance, optimization,
              and continuous improvement to maximize your AI solution's value.
            </p>
            <ul className="space-y-2">
              <li>• Dedicated enterprise success manager</li>
              <li>• 24/7 technical support and monitoring</li>
              <li>• Regular performance reviews and optimization</li>
              <li>• Quarterly strategy sessions and roadmap updates</li>
            </ul>
          </TabsContent>
        </Tabs>
      </section>

      {/* Partners Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-10 text-center">Enterprise Technology Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-center bg-white dark:bg-slate-800 rounded-md p-6 h-20">
              <div className="text-muted-foreground text-sm">Partner Logo {i}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="my-12">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to transform your enterprise with AI?</CardTitle>
            <CardDescription className="text-primary-foreground/90">
              Schedule a consultation with our enterprise solutions team to discuss your specific needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact?type=enterprise">Request Enterprise Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/pricing/enterprise">View Enterprise Pricing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
