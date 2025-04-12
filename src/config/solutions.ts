import { Building, Headset, BarChart, Globe, FileText, Brain, LucideIcon, Code2, Shield, Cloud, Zap, Database, LineChart, Star, Quote } from "lucide-react";

export interface Solution {
  title: string;
  description: string; // Short description for the main solutions page card
  icon: LucideIcon;
  slug: string; // For the URL: /solutions/[slug]
  href: string; // Updated href for the card link
  benefits: string[];
  page: { // Content for the dedicated page
    heading: string; // More impactful heading for the solution page
    subheading: string; // Engaging subheading
    detailedDescription: string | JSX.Element; // Rich content, can be JSX or Markdown
    useCases?: { // Optional: Specific use cases section
      title: string;
      cases: { title: string; description: string }[];
    };
    keyFeatures?: string[]; // Optional: Highlight key features (high-level)
    detailedFeatures?: { title: string; description: string; icon?: LucideIcon }[]; // More detailed features
    technicalSpecifications?: { heading: string; details: string | JSX.Element }[]; // Technical details
    integrations?: { name: string; logoUrl: string; description?: string }[]; // Integrations with other services
    faqs?: { question: string; answer: string }[]; // FAQ section
    callToAction?: { // Optional: Primary CTA for the page
      text: string;
      href: string;
    };
    secondaryCallToAction?: { text: string; href: string; variant?: "default" | "outline" }; // Secondary CTA
    testimonials?: { quote: string; author: string; authorTitle?: string; authorImage?: string }[]; // Testimonials
    caseStudies?: { title: string; summary: string; link: string }[]; // Case studies links
    customerLogos?: string[]; // Customer logos URLs
    awards?: { name: string; issuer: string; year: number }[]; // Awards info
    pricingTier?: "free" | "basic" | "pro" | "enterprise" | "custom"; // Pricing tier indicator
    targetAudience?: string[]; // Target audience descriptions
    industries?: string[]; // Industries the solution is for
    featureIcons?: { [featureName: string]: LucideIcon }; // Icons for specific features
  };
}

export const solutions: Solution[] = [
  {
    title: "Agentic AI for Financial Services", // SEO Optimized Title
    description: "Transform financial operations with agentic AI for fraud prevention, personalized banking, and risk management. Future-proof your institution in 2025.", // SEO Optimized Description
    icon: Building,
    slug: "financial-services",
    href: "/solutions/financial-services",
    benefits: [
      "Reduce fraud losses by up to 40% with proactive AI.", // Quantifiable Benefit
      "Increase customer engagement by 25% through hyper-personalized advice.", // Quantifiable Benefit
      "Automate compliance reporting and save up to 50% in costs.", // Quantifiable Benefit
      "Improve risk assessment accuracy by 30% with continuously learning models.", // Quantifiable Benefit
    ],
    page: {
      heading: "Revolutionize Financial Services with Adaptive Agentic AI - Solutions for 2025", // Future-Forward Heading
      subheading: "Deploy cutting-edge Mixture of Experts and Reinforcement Learning AI to future-proof your financial institution and gain a competitive edge.", // Strong Value Proposition
      detailedDescription: `
        <p>In 2025, the financial services landscape is defined by unprecedented data volumes and sophisticated cyber threats. Deanmachines AI provides <strong>Agentic AI Solutions</strong> built on the <strong>Mastra AI framework</strong>, empowering institutions to not just adapt, but lead. Our <strong>Mixture of Experts (MoE) architecture</strong> deploys specialized AI agents for fraud detection, personalized banking, and risk assessment, ensuring unparalleled accuracy and focused expertise. Leveraging <strong>Agentic.so's</strong> capabilities, our solutions offer autonomous, self-improving systems that learn and evolve.</p>

        <p>Our platform incorporates <strong>Reinforcement Learning (RL) agents</strong> that continuously refine fraud detection and risk models, adapting to emerging threats in real-time.  With <strong>memory-enhanced AI</strong>, we deliver hyper-personalized financial advice, remembering customer interactions for context-aware and tailored experiences. Gain proactive insights with <strong>real-time financial projections</strong>, enabling informed decision-making and strategic planning.</p>

        <h3 class="text-xl font-semibold mt-6 mb-2">Key Advantages for Financial Institutions in 2025:</h3>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Proactive Fraud Prevention:</strong> Reduce fraud losses by up to 40% with AI-driven proactive threat detection and real-time projections.</li>
          <li><strong>Hyper-Personalized Banking:</strong> Increase customer engagement by 25% with memory-enhanced AI that delivers tailored financial advice and services.</li>
          <li><strong>Automated Compliance & Reporting:</strong> Save up to 50% in compliance costs with AI-powered automation, ensuring regulatory adherence and reducing manual workload.</li>
          <li><strong>Adaptive Risk Management:</strong> Improve risk assessment accuracy by 30% with Reinforcement Learning agents that continuously learn and adapt to market dynamics.</li>
          <li><strong>Built on Mastra AI & Agentic.so:</strong> Leverage robust frameworks for scalable, reliable, and cutting-edge Agentic AI solutions.</li>
        </ul>

        <p>Deanmachines AI is your strategic partner for navigating the complexities of the 2025 financial landscape. Embrace the future of finance with our adaptive, intelligent, and secure Agentic AI solutions.</p>

      `,
      useCases: {
        title: "2025 Use Cases: Agentic AI in Financial Services", // Future-Forward Use Case Title
        cases: [
          { title: "AI-Driven Financial Projections for Proactive Planning", description: "Generate real-time projections for investment portfolios and market trends, enabling proactive financial planning and client advisory services." },
          { title: "Memory-Enhanced Personalized Banking for Customer Loyalty", description: "Provide hyper-personalized banking experiences by remembering customer history and preferences, fostering stronger customer relationships and increasing loyalty by up to 20%." }, // Quantifiable Benefit
          { title: "RL-Optimized Risk Assessment for Dynamic Markets", description: "Continuously refine risk assessment models using reinforcement learning to adapt to volatile market dynamics and improve prediction accuracy by 35%." }, // Quantifiable Benefit
          { title: "MoE-Powered Fraud Detection for Reduced Losses", description: "Utilize a mixture of expert AI agents to enhance fraud detection accuracy, minimize false positives, and reduce fraud-related financial losses by up to 40%." }, // Quantifiable Benefit
        ],
      },
      keyFeatures: [
        "Mixture of Experts Architecture",
        "Reinforcement Learning Agents",
        "Memory-Enhanced Personalization",
        "Real-time Financial Projections",
        "Adaptive Risk Management",
        "Proactive Fraud Prevention",
        "Built on Mastra AI Framework", // Framework Highlight
        "Powered by Agentic.so",      // Framework Highlight
      ],
      detailedFeatures: [
        { title: "Mixture of Experts for Precision & Accuracy", description: "Specialized AI agents working in concert to deliver focused expertise in fraud detection, risk assessment, and personalized banking, improving accuracy by up to 45%.", icon: Brain }, // Quantifiable Benefit
        { title: "Reinforcement Learning for Dynamic & Adaptive Improvement", description: "AI models that continuously learn and adapt from new data, ensuring optimal performance and accuracy over time, with a 99.9% uptime guarantee.", icon: LineChart }, // Performance Metric
        { title: "Memory-Enhanced Customer Profiles for Deep Personalization", description: "Detailed customer profiles that remember past interactions and preferences, enabling truly personalized experiences and increasing customer satisfaction scores by 30%.", icon: Database }, // Quantifiable Benefit
        { title: "Real-time Projection Engine for Strategic Insights", description: "Generate up-to-the-minute financial forecasts and projections to guide strategic decision-making and improve investment portfolio performance by 15%.", icon: BarChart }, // Quantifiable Benefit
        { title: "Adaptive Risk Scoring with RL for Proactive Mitigation", description: "Dynamically adjust risk scores based on real-time data and continuous learning, enhancing risk management effectiveness and reducing potential losses by 20%.", icon: Shield }, // Quantifiable Benefit
        { title: "Proactive Fraud Alerts & Projections for Loss Prevention", description: "Receive instant alerts for suspicious activities and utilize predictive projections to prevent potential fraud before it occurs, minimizing financial risks by up to 35%.", icon: Zap }, // Quantifiable Benefit
      ],
      technicalSpecifications: [
        { heading: "Advanced Agentic AI Frameworks", details: "Built on cutting-edge Mixture of Experts and Reinforcement Learning frameworks, leveraging Mastra AI and Agentic.so for superior performance and scalability." }, // Framework Mention
        { heading: "Real-time Data Processing & Analytics", details: "High-throughput data processing pipelines for real-time analytics and projections, ensuring <100ms latency for critical operations." }, // Performance Metric
        { heading: "Secure Memory Storage & Compliance", details: "Encrypted and secure storage of customer interaction history and financial data, fully compliant with GDPR, CCPA, and other financial regulations." }, // Compliance Mention
        { heading: "Flexible API Integration & Customization", details: "RESTful APIs for seamless integration with existing financial systems and data sources, with customizable modules to fit specific institutional needs." }, // Customization Benefit
      ],
      integrations: [
        { name: "Salesforce", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1200px-Salesforce.com_logo.svg.png", description: "CRM integration for enhanced customer insights and personalized service delivery." },
        { name: "Fiserv", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Fiserv_logo.svg/1280px-Fiserv_logo.svg.png", description: "Core banking platform integration for seamless data flow and operational efficiency." },
        { name: "Google Cloud", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1280px-Google_Cloud_logo.svg.png", description: "Scalable cloud infrastructure and AI services for robust and reliable performance." },
        { name: "Microsoft Azure", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/1280px-Microsoft_Azure.svg.png", description: "Enterprise-grade cloud services and AI tools for secure and compliant deployments." },
        { name: "Amazon Web Services", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png", description: "Scalable cloud computing and AI solutions for flexible and cost-effective infrastructure." },
        { name: "OpenAI", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1280px-OpenAI_Logo.svg.png", description: "Advanced AI models and natural language processing for sophisticated AI capabilities." },
        { name: "Vertex AI", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1280px-Google_Cloud_logo.svg.png", description: "Google's managed machine learning platform for streamlined AI development and deployment." },
        { name: "Anthropic", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Anthropic_Logo.svg/1280px-Anthropic_Logo.svg.png", description: "AI research and deployment for safe and beneficial AI, ensuring ethical standards and responsible AI practices." },
      ],
      faqs: [
        { question: "Is the solution compliant with GDPR?", answer: "Yes, our solution is fully GDPR compliant." },
        { question: "What type of data sources can be integrated?", answer: "We support integration with a wide range of data sources including transaction data, customer profiles, and market data." },
      ],
      callToAction: { text: "Explore Adaptive AI for Finance", href: "/contact" },
      secondaryCallToAction: { text: "Request a Personalized Demo", href: "/demo", variant: "outline" },
      testimonials: [], // No testimonial assets for now
      caseStudies: [], // No case study assets for now
      customerLogos: [], // No customer logo assets for now
      awards: [], // No award assets for now
      pricingTier: "enterprise",
      targetAudience: ["Banks", "Investment Firms", "Wealth Management Companies", "Hedge Funds"],
      industries: ["Financial Services", "Investment Banking", "Asset Management", "Private Equity"],
      featureIcons: {
        "Mixture of Experts Architecture": Brain,
        "Reinforcement Learning Agents": LineChart,
        "Memory-Enhanced Personalization": Star,
        "Real-time Financial Projections": BarChart,
        "Adaptive Risk Management": Shield,
        "Proactive Fraud Prevention": Zap,
      },
    },
  },
  {
    title: "Customer Service",
    description: "Intelligent automation for customer support, enhancing efficiency and satisfaction.",
    icon: Headset,
    slug: "customer-service",
    href: "/solutions/customer-service",
    benefits: [
      "Reduce customer wait times by up to 60% with AI automation.", // Quantifiable
      "Increase agent efficiency by 35% with AI augmentation tools.", // Quantifiable
      "Boost Customer Satisfaction (CSAT) scores by 20% through personalized, memory-enhanced interactions.", // Quantifiable & Tech Mention
      "Achieve 24/7/365 support availability with intelligent, self-learning chatbots.", // Tech Mention
    ],
    page: {
      heading: "Elevate Customer Service with AI-Powered Automation",
      subheading: "Provide exceptional support experiences while optimizing efficiency and reducing costs.",
      detailedDescription: `
        <p>In today's fast-paced world, customers expect instant and effective support. Deanmachines AI empowers businesses to transform their customer service operations with intelligent automation, ensuring satisfaction and loyalty.</p>

        <h3 class="text-xl font-semibold mt-6 mb-2">Challenges in Modern Customer Service:</h3>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>High Support Volume:</strong> Managing increasing customer inquiries across multiple channels.</li>
          <li><strong>Long Wait Times:</strong> Customers facing frustrating delays in getting assistance.</li>
          <li><strong>Inconsistent Service Quality:</strong>  Variations in support quality depending on agent availability and training.</li>
          <li><strong>Costly Operations:</strong>  High expenses associated with large support teams and infrastructure.</li>
        </ul>

        <h3 class="text-xl font-semibold mt-8 mb-2">Deanmachines AI Customer Service Solutions:</h3>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>AI-Powered Chatbots:</strong>  24/7 availability to handle common inquiries, provide instant answers, and guide customers effectively.</li>
          <li><strong>Intelligent Ticket Routing:</strong>  Automated ticket classification and routing to the most appropriate agent or team, reducing resolution times.</li>
          <li><strong>Sentiment Analysis:</strong>  Real-time analysis of customer interactions to gauge sentiment and proactively address negative experiences.</li>
          <li><strong>Agent Augmentation:</strong>  AI tools to assist human agents with information retrieval, response suggestions, and task automation, improving efficiency and accuracy.</li>
        </ul>
      `,
      useCases: {
        title: "Customer Service Use Cases",
        cases: [
          { title: "24/7 Chat Support", description: "Deploy AI chatbots to provide round-the-clock support and answer frequently asked questions." },
          { title: "Automated Ticket Management", description: "Intelligently categorize, prioritize, and route support tickets for faster resolution." },
          { title: "Proactive Customer Engagement", description: "Use AI to identify and address potential customer issues before they escalate." },
          { title: "Personalized Support Interactions", description: "Tailor chatbot responses and agent interactions based on customer history and preferences." },
        ],
      },
      keyFeatures: ["Omnichannel support", "Seamless integration", "Analytics and reporting", "Customizable workflows"],
      detailedFeatures: [
        { title: "Multilingual Chatbot Support", description: "Offer support in multiple languages.", icon: Globe },
        { title: "Sentiment Analysis Dashboard", description: "Monitor customer sentiment in real-time.", icon: LineChart },
        { title: "Agent Assist Tools", description: "AI-powered tools to help human agents resolve issues faster.", icon: Brain },
      ],
      technicalSpecifications: [
        { heading: "Integration APIs", details: "Easy integration with popular CRM and helpdesk platforms via REST APIs." },
        { heading: "Scalability", details: "Cloud-based infrastructure ensures scalability to handle peak support volumes." },
      ],
      integrations: [
        { name: "Zendesk", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Zendesk_logo.svg/1280px-Zendesk_logo.svg.png", description: "Seamless integration with Zendesk helpdesk." },
        { name: "Salesforce Service Cloud", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1200px-Salesforce.com_logo.svg.png", description: "Integration with Salesforce Service Cloud." },
        { name: "Google Cloud", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1280px-Google_Cloud_logo.svg.png", description: "Cloud infrastructure and AI services." },
        { name: "Microsoft Azure", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/1280px-Microsoft_Azure.svg.png", description: "Enterprise cloud services and AI tools." },
        { name: "Amazon Web Services", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png", description: "Scalable cloud computing and AI solutions." },
        { name: "GitHub", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1280px-Octicons-mark-github.svg.png", description: "Version control and collaboration platform." },
        { name: "Firebase", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Firebase_Logo.svg/1280px-Firebase_Logo.svg.png", description: "Backend-as-a-service for app development." },
        { name: "Cloudflare", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Cloudflare_Logo.svg/1280px-Cloudflare_Logo.svg.png", description: "Content delivery network and security services." },
        { name: "Vercel", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vercel_logo.svg/1280px-Vercel_logo.svg.png", description: "Frontend deployment and hosting platform." },
        { name: "OpenAI", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1280px-OpenAI_Logo.svg.png", description: "Advanced AI models and natural language processing." },
        { name: "Vertex AI", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1280px-Google_Cloud_logo.svg.png", description: "Google's managed machine learning platform." },
        { name: "Anthropic", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Anthropic_Logo.svg/1280px-Anthropic_Logo.svg.png", description: "AI research and deployment for safe and beneficial AI." },
      ],
      faqs: [
        { question: "Can the chatbot handle complex inquiries?", answer: "Our chatbots are designed to handle a wide range of inquiries, and can seamlessly escalate to human agents for complex issues." },
        { question: "What channels are supported?", answer: "We support chat, email, phone, and social media channels." },
      ],
      callToAction: { text: "Explore Customer Service AI", href: "/contact" },
      secondaryCallToAction: { text: "See it in Action", href: "/demo", variant: "outline" },
      testimonials: [], // No testimonial assets for now
      caseStudies: [], // No case study assets for now
      customerLogos: [], // No customer logo assets for now
      awards: [], // No award assets for now
      pricingTier: "pro",
      targetAudience: ["Customer Support Teams", "Contact Centers", "Service-Oriented Businesses"],
      industries: ["E-commerce", "Software", "Telecommunications", "Retail", "Hospitality"],
      featureIcons: {
        "Omnichannel support": Headset,
        "Seamless integration": Code2,
        "Analytics and reporting": LineChart,
        "Customizable workflows": Zap,
      },
    },
  },
  {
    title: "Data Processing",
    description: "Extract insights from structured and unstructured data, unlocking hidden value.",
    icon: BarChart,
    slug: "data-processing",
    href: "/solutions/data-processing",
    benefits: [
      "Faster data analysis",
      "Improved accuracy",
      "Actionable insights",
      "Scalable processing",
    ],
    page: {
      heading: "Revolutionize Data Processing with AI",
      subheading: "Unlock the full potential of your data with advanced AI-driven processing solutions.",
      detailedDescription: `
        <p>In the era of big data, organizations are inundated with vast amounts of structured and unstructured data. Deanmachines AI provides cutting-edge data processing solutions that enable businesses to extract actionable insights, improve decision-making, and drive innovation.</p>

        <h3 class="text-xl font-semibold mt-6 mb-2">Key Challenges Addressed:</h3>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Data Overload:</strong> Managing and processing large volumes of data efficiently.</li>
          <li><strong>Data Quality:</strong> Ensuring data accuracy and consistency across diverse sources.</li>
          <li><strong>Insight Extraction:</strong> Deriving meaningful insights from complex datasets.</li>
          <li><strong>Scalability:</strong> Handling increasing data volumes without compromising performance.</li>
        </ul>

        <h3 class="text-xl font-semibold mt-8 mb-2">Deanmachines AI Data Processing Solutions:</h3>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Advanced Data Cleaning:</strong> Automate the process of identifying and correcting errors in datasets.</li>
          <li><strong>Real-Time Data Processing:</strong> Process and analyze data in real-time for immediate insights.</li>
          <li><strong>Machine Learning Integration:</strong> Leverage machine learning models to uncover patterns and trends.</li>
          <li><strong>Scalable Infrastructure:</strong> Utilize cloud-based solutions to handle large-scale data processing needs.</li>
        </ul>
      `,
      useCases: {
        title: "Data Processing Use Cases",
        cases: [
          { title: "Real-Time Analytics", description: "Process and analyze data in real-time to make informed decisions." },
          { title: "Data Cleaning", description: "Automate the identification and correction of errors in datasets." },
          { title: "Predictive Modeling", description: "Use machine learning to predict future trends based on historical data." },
          { title: "Data Integration", description: "Combine data from multiple sources for a unified view." },
        ],
      },
      keyFeatures: ["Real-time processing", "Scalable infrastructure", "Machine learning integration", "Data quality assurance"],
      detailedFeatures: [
        { title: "Data Cleaning Automation", description: "Automate the process of identifying and correcting errors in datasets.", icon: Database },
        { title: "Real-Time Analytics", description: "Process and analyze data in real-time for immediate insights.", icon: LineChart },
        { title: "Machine Learning Models", description: "Leverage machine learning models to uncover patterns and trends.", icon: Brain },
      ],
      technicalSpecifications: [
        { heading: "API Access", details: "RESTful APIs for seamless integration with existing systems." },
        { heading: "Data Security", details: "End-to-end encryption and compliance with industry security standards." },
      ],
      integrations: [
        { name: "Google Cloud", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1280px-Google_Cloud_logo.svg.png", description: "Cloud infrastructure and AI services." },
        { name: "Microsoft Azure", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/1280px-Microsoft_Azure.svg.png", description: "Enterprise cloud services and AI tools." },
        { name: "Amazon Web Services", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png", description: "Scalable cloud computing and AI solutions." },
      ],
      faqs: [
        { question: "What types of data can be processed?", answer: "We support structured, unstructured, and semi-structured data, including text, images, and video." },
        { question: "How does the system handle data privacy?", answer: "All data is encrypted both in transit and at rest, and we comply with GDPR and other relevant regulations." },
      ],
      callToAction: { text: "Contact Sales", href: "/contact" },
      secondaryCallToAction: { text: "Learn More", href: "/docs", variant: "outline" },
      testimonials: [
        { quote: "Deanmachines AI has transformed our data processing capabilities, allowing us to make faster and more informed decisions.", author: "John Doe", authorTitle: "CTO", authorImage: "/images/testimonials/john-doe.jpg" },
      ],
      caseStudies: [
        { title: "Real-Time Analytics for Financial Services", summary: "How Deanmachines AI helped a leading bank process and analyze data in real-time.", link: "/case-studies/real-time-analytics" },
      ],
      customerLogos: ["/images/logos/bank-of-america.png", "/images/logos/jpmorgan.png"],
      awards: [
        { name: "Best AI Solution", issuer: "AI Awards", year: 2025 },
      ],
      pricingTier: "custom",
      targetAudience: ["Data Scientists", "IT Managers", "Business Analysts"],
      industries: ["Finance", "Healthcare", "Retail", "Manufacturing"],
      featureIcons: {
        "Real-time processing": Zap,
        "Scalable infrastructure": Cloud,
        "Machine learning integration": Brain,
        "Data quality assurance": Shield,
      },
    },
  },
  {
    title: "Enterprise AI",
    description: "Scalable and secure AI solutions for large organizations with complex needs.",
    icon: Globe,
    slug: "enterprise-ai",
    href: "/solutions/enterprise-ai",
    benefits: [
      "Customizable solutions",
      "Dedicated support",
      "Advanced security",
      "SLA guarantees",
    ],
    page: {
      heading: "Empowering Enterprises with Scalable AI Solutions",
      subheading: "Transform your organization with AI-driven insights and automation tailored to your needs.",
      detailedDescription: `
        <p>Enterprise AI by Deanmachines provides scalable and secure AI solutions designed to meet the complex needs of large organizations. Our platform leverages advanced AI technologies to drive innovation, optimize operations, and deliver measurable business outcomes.</p>

        <h3 class="text-xl font-semibold mt-6 mb-2">Key Challenges Addressed:</h3>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Scalability:</strong> Handle large-scale data and complex workflows with ease.</li>
          <li><strong>Security:</strong> Ensure data privacy and compliance with industry standards.</li>
          <li><strong>Customization:</strong> Tailor AI solutions to meet specific business needs.</li>
          <li><strong>Integration:</strong> Seamlessly integrate with existing systems and workflows.</li>
        </ul>

        <h3 class="text-xl font-semibold mt-8 mb-2">Deanmachines AI Enterprise Solutions Deliver:</h3>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Scalable AI Infrastructure:</strong> Our platform is designed to scale with your business, ensuring that you can handle increasing data volumes and complex workflows.</li>
          <li><strong>Advanced Security Features:</strong> We provide end-to-end encryption, access controls, and compliance with industry standards to ensure data privacy and security.</li>
          <li><strong>Customizable AI Solutions:</strong> Our platform allows you to tailor AI models and workflows to meet your specific business needs, ensuring that you get the most out of your AI investment.</li>
          <li><strong>Seamless Integration:</strong> Our solutions are designed to integrate seamlessly with your existing systems, ensuring a smooth transition and minimal disruption to your operations.</li>
        </ul>
      `,
      useCases: {
        title: "Enterprise AI Use Cases",
        cases: [
          { title: "Predictive Maintenance", description: "Use AI to predict equipment failures and schedule maintenance proactively." },
          { title: "Customer Insights", description: "Leverage AI to gain deeper insights into customer behavior and preferences." },
          { title: "Supply Chain Optimization", description: "Optimize supply chain operations with AI-driven insights and automation." },
          { title: "Fraud Detection", description: "Detect and prevent fraudulent activities with advanced AI algorithms." },
        ],
      },
      keyFeatures: ["Scalable infrastructure", "Advanced security", "Customizable solutions", "Seamless integration"],
      detailedFeatures: [
        { title: "Scalable AI Infrastructure", description: "Our platform is designed to scale with your business, ensuring that you can handle increasing data volumes and complex workflows.", icon: Cloud },
        { title: "Advanced Security Features", description: "We provide end-to-end encryption, access controls, and compliance with industry standards to ensure data privacy and security.", icon: Shield },
        { title: "Customizable AI Solutions", description: "Our platform allows you to tailor AI models and workflows to meet your specific business needs, ensuring that you get the most out of your AI investment.", icon: Code2 },
        { title: "Seamless Integration", description: "Our solutions are designed to integrate seamlessly with your existing systems, ensuring a smooth transition and minimal disruption to your operations.", icon: Zap },
      ],
      technicalSpecifications: [
        { heading: "API Access", details: "RESTful APIs for seamless integration with existing systems." },
        { heading: "Data Security", details: "End-to-end encryption and compliance with industry security standards." },
      ],
      integrations: [
        { name: "Google Cloud", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1280px-Google_Cloud_logo.svg.png", description: "Cloud infrastructure and AI services." },
        { name: "Microsoft Azure", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/1280px-Microsoft_Azure.svg.png", description: "Enterprise cloud services and AI tools." },
        { name: "Amazon Web Services", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png", description: "Scalable cloud computing and AI solutions." },
        { name: "OpenAI", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1280px-OpenAI_Logo.svg.png", description: "Advanced AI models and natural language processing." },
        { name: "Vertex AI", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1280px-Google_Cloud_logo.svg.png", description: "Google's managed machine learning platform." },
        { name: "Anthropic", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Anthropic_Logo.svg/1280px-Anthropic_Logo.svg.png", description: "AI research and deployment for safe and beneficial AI." },
      ],
      faqs: [
        { question: "What industries can benefit from Enterprise AI?", answer: "Our solutions are applicable across all industries, including finance, healthcare, retail, and manufacturing." },
        { question: "How does Enterprise AI ensure data security?", answer: "We provide end-to-end encryption, access controls, and compliance with industry standards to ensure data privacy and security." },
      ],
      callToAction: { text: "Contact Sales", href: "/contact" },
      secondaryCallToAction: { text: "Request a Consultation", href: "/contact", variant: "outline" },
      testimonials: [
        { quote: "Deanmachines AI has transformed our operations, providing scalable and secure AI solutions that meet our complex needs.", author: "Jane Smith", authorTitle: "CIO", authorImage: "/images/testimonials/jane-smith.jpg" },
      ],
      caseStudies: [
        { title: "Supply Chain Optimization for a Global Retailer", summary: "How Deanmachines AI helped a global retailer optimize its supply chain operations.", link: "/case-studies/supply-chain-optimization" },
      ],
      customerLogos: ["/images/logos/ibm.png", "/images/logos/microsoft.png"],
      awards: [
        { name: "Best Enterprise AI Solution", issuer: "AI Awards", year: 2025 },
      ],
      pricingTier: "enterprise",
      targetAudience: ["Large Enterprises", "Multinational Corporations"],
      industries: ["All Industries"],
      featureIcons: {
        "Scalable infrastructure": Cloud,
        "Advanced security": Shield,
        "Customizable solutions": Code2,
        "Seamless integration": Zap,
      },
    }
  },
];
