import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Stethoscope,
  Lock,
  Bot,
  Share2,
  Upload,
  BarChart,
} from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const features = [
    {
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: 'Unified Health Records',
      description:
        'Securely upload and manage all your medical records, prescriptions, and lab reports in one place.',
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: 'Blockchain Security',
      description:
        'Leverage the power of blockchain for immutable, patient-owned health data with consent-based sharing.',
    },
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: 'AI Health Assistant',
      description:
        'Get personalized health insights, allergy alerts, and lifestyle recommendations from our intelligent AI.',
    },
    {
      icon: <Share2 className="h-8 w-8 text-primary" />,
      title: 'Seamless Sharing',
      description:
        'Share your medical history with doctors via secure, time-bound links for better-coordinated care.',
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: 'Health Analytics',
      description:
        'Visualize your health trends for metrics like blood pressure, sugar, and BMI with our intuitive dashboard.',
    },
    {
      icon: <Stethoscope className="h-8 w-8 text-primary" />,
      title: 'Doctor Coordination',
      description:
        'Enable doctors to view your history, add prescriptions, and get AI summaries for faster, accurate diagnoses.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold text-lg">MediSafe</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-headline">
                  Your Health, Your Control. Welcome to MediSafe.
                </h1>
                <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                  A decentralized, AI-powered health record system that puts you
                  in charge of your medical data. Secure, smart, and simple.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50 dark:bg-secondary/20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                    Key Features
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                    Empowering Your Health Journey
                  </h2>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    MediSafe combines cutting-edge technology to provide a
                    comprehensive solution for personal health management.
                  </p>
                </div>
              </div>
              <div className="grid gap-6">
                {features.slice(0, 3).map((feature) => (
                  <div key={feature.title} className="flex items-start gap-4">
                    {feature.icon}
                    <div className="grid gap-1">
                      <h3 className="text-lg font-bold">{feature.title}</h3>
                      <p className="text-sm text-foreground/80">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} MediSafe. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
