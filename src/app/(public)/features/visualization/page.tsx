import { Metadata } from "next";
import { generateMockData } from "@/lib/mock-data";
import { ResourceUtilization } from "@/components/visualization/ResourceUtilization";
import { MLMetricsPlot } from "@/components/visualization/MLMetricsPlot";
import { AIActivityHeatmap } from "@/components/visualization/AIActivityHeatmap";

export const metadata: Metadata = {
  title: "Advanced AI Visualizations - DeanMachines",
  description: "Experience cutting-edge 2025 AI system visualizations with real-time analytics and predictive insights.",
};

export default function VisualizationFeaturePage() {
  const { aiActivityData, mlMetricsData, resourceData } = generateMockData();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Advanced AI System Visualizations</h1>
        <p className="text-xl text-muted-foreground">
          Explore our cutting-edge 2025 visualization suite designed for modern AI systems.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Resource Utilization Analytics</h2>
          <p className="text-muted-foreground mb-4">
            Real-time monitoring of system resources with anomaly detection and predictive insights.
          </p>
          <ResourceUtilization
            data={resourceData}
            title="System Resource Analytics"
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">ML Model Performance Metrics</h2>
          <p className="text-muted-foreground mb-4">
            Track model accuracy, loss, and latency across training and inference phases.
          </p>
          <MLMetricsPlot
            data={mlMetricsData}
            title="Model Performance Analytics"
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">AI Activity Patterns</h2>
          <p className="text-muted-foreground mb-4">
            Visualize AI system activity patterns and workload distribution over time.
          </p>
          <AIActivityHeatmap
            data={aiActivityData}
            height={400}
          />
        </section>

        <section className="bg-secondary/50 rounded-lg p-6 mt-12">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Live monitoring and updates with sub-second latency for immediate insights.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Anomaly Detection</h3>
              <p className="text-sm text-muted-foreground">
                Advanced algorithms identify and highlight system anomalies automatically.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Predictive Insights</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered forecasting helps prevent issues before they occur.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Interactive Exploration</h3>
              <p className="text-sm text-muted-foreground">
                Rich interaction capabilities for deep diving into your data.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Adaptive Theming</h3>
              <p className="text-sm text-muted-foreground">
                Seamless light/dark mode support with customizable color schemes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Performance Optimized</h3>
              <p className="text-sm text-muted-foreground">
                Built for handling large datasets without compromising responsiveness.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
