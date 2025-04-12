import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { solutions } from "@/config/solutions";
import { CallToAction } from "@/components/common/CallToAction";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { siteConfig } from '@/config/site';

// Generate static paths for each solution
export async function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

// Dynamically generate metadata for each solution page
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const slug = params.slug;
  const solution = solutions.find((s) => s.slug === slug);

  if (!solution) {
    return {
      title: 'Solution Not Found',
    };
  }

  return {
    title: `${solution.page.heading} | ${siteConfig.name}`,
    description: solution.page.subheading || solution.description,
  };
}

interface SolutionPageProps {
  params: { slug: string };
}

export default function SolutionPage({ params }: SolutionPageProps) {
  const slug = params.slug;
  const solution = solutions.find((s) => s.slug === slug);

  if (!solution) {
    notFound();
  }

  return (
    <div className="container py-20">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{solution.page.heading}</h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">{solution.page.subheading}</p>
      </section>

      <section className="mb-16">
        <div className="prose prose-lg max-w-none mx-auto dark:prose-invert">
          <div>{solution.page.detailedDescription}</div>
        </div>
      </section>

      {solution.page.useCases && (
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">{solution.page.useCases.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solution.page.useCases.cases.map((useCase) => (
              <Card key={useCase.title} className="p-6">
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground">{useCase.description}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {solution.page.keyFeatures && (
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Key Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {solution.page.keyFeatures.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {solution.page.callToAction && (
        <section className="text-center">
          <CallToAction
            title={solution.page.callToAction.text}
            href={solution.page.callToAction.href}
            variant="default"
            size="lg"
            showArrow
          />
        </section>
      )}
    </div>
  );
}
