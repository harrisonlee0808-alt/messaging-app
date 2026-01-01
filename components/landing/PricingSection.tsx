"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out the platform",
    features: [
      "Up to 3 workspaces",
      "Up to 5 team members",
      "Basic collaboration features",
      "Community support",
    ],
    cta: "Get Started",
    href: "/auth/signup",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professional teams",
    features: [
      "Unlimited workspaces",
      "Unlimited team members",
      "Advanced AI features",
      "Priority support",
      "Custom integrations",
      "Advanced analytics",
    ],
    cta: "Start Free Trial",
    href: "/auth/signup",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Custom SLA",
      "On-premise deployment",
      "Advanced security",
      "Custom training",
    ],
    cta: "Contact Sales",
    href: "mailto:sales@collabcode.com",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="container px-4 py-24 md:py-32">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl">
          Simple, transparent pricing
        </h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Choose the plan that's right for your team.
        </p>
        <div className="grid gap-6 md:grid-cols-3 mt-12 w-full">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

