This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```mermaid
graph TB
    User((External User))

    subgraph "Frontend Application"
        NextApp["Next.js Application<br>(Next.js 13+)"]

        subgraph "Core Components"
            Layout["Layout Manager<br>(React/TSX)"]
            ThemeProvider["Theme Provider<br>(next-themes)"]
            Router["Router<br>(Next.js App Router)"]
            MDXProcessor["MDX Processor<br>(Contentlayer)"]
        end

        subgraph "Layout Components"
            NavBar["Navigation Bar<br>(React/TSX)"]
            Footer["Footer<br>(React/TSX)"]
            MobileNav["Mobile Navigation<br>(React/TSX)"]
        end

        subgraph "Documentation Components"
            DocsSidebar["Docs Sidebar<br>(React/TSX)"]
            DocsSearch["Docs Search<br>(React/TSX)"]
            DocsLayout["Docs Layout<br>(React/TSX)"]
            MDXComponents["MDX Components<br>(React/TSX)"]
        end

        subgraph "UI Components"
            CommonUI["Common UI Elements<br>(React/TSX)"]
            ThemeToggle["Theme Toggle<br>(React/TSX)"]
            SearchInput["Search Input<br>(React/TSX)"]
            Buttons["Button Components<br>(shadcn/ui)"]
        end
    end

    subgraph "Content Layer"
        ContentManager["Content Manager<br>(Contentlayer)"]

        subgraph "Content Types"
            BlogPosts["Blog Posts<br>(MDX)"]
            Documentation["Documentation<br>(MDX)"]
        end
    end

    subgraph "Static Assets"
        PublicAssets["Public Assets<br>(Static Files)"]
        Styles["Styles<br>(TailwindCSS)"]
    end

    %% User Interactions
    User -->|"Accesses"| NextApp

    %% Core Component Relationships
    NextApp -->|"Uses"| Layout
    Layout -->|"Includes"| ThemeProvider
    Layout -->|"Uses"| Router
    NextApp -->|"Processes"| MDXProcessor

    %% Layout Component Relationships
    Layout -->|"Renders"| NavBar
    Layout -->|"Renders"| Footer
    NavBar -->|"Shows on mobile"| MobileNav

    %% Documentation Component Relationships
    DocsLayout -->|"Includes"| DocsSidebar
    DocsLayout -->|"Includes"| DocsSearch
    DocsLayout -->|"Uses"| MDXComponents

    %% UI Component Relationships
    NavBar -->|"Uses"| ThemeToggle
    NavBar -->|"Uses"| SearchInput
    NavBar -->|"Uses"| Buttons
    CommonUI -->|"Provides"| Buttons

    %% Content Management
    ContentManager -->|"Manages"| BlogPosts
    ContentManager -->|"Manages"| Documentation
    MDXProcessor -->|"Processes"| BlogPosts
    MDXProcessor -->|"Processes"| Documentation

    %% Static Asset Relationships
    NextApp -->|"Serves"| PublicAssets
    NextApp -->|"Applies"| Styles
```
