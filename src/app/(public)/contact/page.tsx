import * as React from "react"
import { type Metadata } from "next"
import { Mail, MessageCircle, Phone } from "lucide-react"

import { Breadcrumb } from "@/components/common/breadcrumb"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const metadata: Metadata = {
  title: "Contact - Mastra AI",
  description: "Get in touch with our team for support, sales inquiries, or partnership opportunities.",
}

export default function ContactPage() {
  return (
    <div className="container py-10">
      <Breadcrumb
        items={[{ title: "Contact" }]}
        className="mb-8"
      />

      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <h1 className="font-heading text-4xl">Get in Touch</h1>
            <p className="mt-4 text-muted-foreground">
              Have questions? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>support@mastra.ai</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>Live Chat (9am-5pm PST)</span>
              </div>
            </div>
          </div>

          <Card className="p-6">
            <form className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Doe" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="john@example.com"
                    type="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiry-type">Type of Inquiry</Label>
                  <Select defaultValue="support">
                    <SelectTrigger id="inquiry-type">
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="sales">Sales Inquiry</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    className="min-h-[150px]"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </Card>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {[
              {
                q: "What types of support do you offer?",
                a: "We provide technical support via email, phone, and live chat. Enterprise customers get priority 24/7 support.",
              },
              {
                q: "How quickly can I expect a response?",
                a: "We typically respond to support inquiries within 24 hours. Enterprise customers receive responses within 2 hours.",
              },
              {
                q: "Do you offer custom solutions?",
                a: "Yes, we work with enterprise customers to develop custom AI agent solutions tailored to their needs.",
              },
              {
                q: "Can I schedule a demo?",
                a: "Absolutely! Select 'Sales Inquiry' in the form above and we'll arrange a personalized demo.",
              },
            ].map((item) => (
              <div key={item.q}>
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
