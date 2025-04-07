import { Metadata } from "next"
import { Mail, MessageSquare, Building, Phone } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { IconWrapper } from "@/components/common/IconWrapper"

export const metadata: Metadata = {
  title: `Contact Us - ${siteConfig.name}`,
  description: "Get in touch with our team for any questions or inquiries.",
}

const contactMethods = [
  {
    title: "Email",
    description: "Drop us a line anytime",
    icon: Mail,
    content: "contact@deanmachines.com",
  },
  {
    title: "Live Chat",
    description: "Available during business hours",
    icon: MessageSquare,
    content: "Open chat support",
  },
  {
    title: "Office",
    description: "Come visit us",
    icon: Building,
    content: "123 AI Avenue, Tech District",
  },
  {
    title: "Phone",
    description: "Mon-Fri from 9am to 5pm",
    icon: Phone,
    content: "+1 (555) 123-4567",
  },
]

export default function ContactPage() {
  return (
    <div className="container relative">
      {/* Hero Section */}
      <section className="mx-auto max-w-5xl py-12 text-center md:py-20">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
          Get in Touch
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          Have questions? We&apos;d love to hear from you.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Methods */}
        <div className="grid gap-4 sm:grid-cols-2">
          {contactMethods.map((method, index) => (
            <Card key={index} className="border-2">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <IconWrapper
                    icon={method.icon}
                    className="rounded-lg border bg-muted p-2"
                  />
                  <div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{method.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we&apos;ll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Enter your email" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message"
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
