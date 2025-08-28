
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Stethoscope,
  Lock,
  Bot,
  Share2,
  Upload,
  BarChart,
  ArrowRight,
} from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';

export default function Home() {
  const features = [
    {
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: 'Unified Health Records',
      description:
        'Securely upload and manage all your medical records, prescriptions, and lab reports in one place.',
      image: 'https://picsum.photos/800/600?random=1',
      imageHint: 'medical chart'
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: 'Blockchain Security',
      description:
        'Leverage the power of blockchain for immutable, patient-owned health data with consent-based sharing.',
      image: 'https://picsum.photos/800/600?random=2',
      imageHint: 'security technology'
    },
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: 'AI Health Assistant',
      description:
        'Get personalized health insights, allergy alerts, and lifestyle recommendations from our intelligent AI.',
      image: 'https://picsum.photos/800/600?random=3',
      imageHint: 'artificial intelligence'
    },
    {
      icon: <Share2 className="h-8 w-8 text-primary" />,
      title: 'Seamless Sharing',
      description:
        'Share your medical history with doctors via secure, time-bound links for better-coordinated care.',
      image: 'https://picsum.photos/800/600?random=4',
      imageHint: 'data sharing'
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: 'Health Analytics',
      description:
        'Visualize your health trends for metrics like blood pressure, sugar, and BMI with our intuitive dashboard.',
      image: 'https://picsum.photos/800/600?random=5',
      imageHint: 'analytics dashboard'
    },
    {
      icon: <Stethoscope className="h-8 w-8 text-primary" />,
      title: 'Doctor Coordination',
      description:
        'Enable doctors to view your history, add prescriptions, and get AI summaries for faster, accurate diagnoses.',
      image: 'https://picsum.photos/800/600?random=6',
      imageHint: 'doctor patient'
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
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
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full h-[80vh] flex items-center justify-center text-center">
             <Image
                src="https://picsum.photos/1920/1080?random=hero"
                alt="Hero background"
                fill
                className="object-cover -z-10 brightness-50"
                data-ai-hint="health technology"
            />
            <div className="container px-4 md:px-6 text-white">
                <div className="flex flex-col items-center space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline">
                        Your Health, Your Control.
                        </h1>
                        <p className="mx-auto max-w-[700px] text-lg text-white/80 md:text-xl">
                        A decentralized, AI-powered health record system that puts you
                        in charge of your medical data. Secure, smart, and simple.
                        </p>
                    </div>
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/signup">
                        Join MediSafe Today <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>


        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                        Key Features
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                        Empowering Your Health Journey
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        MediSafe combines cutting-edge technology to provide a
                        comprehensive solution for personal health management, ensuring your data is secure, accessible, and insightful.
                    </p>
                </div>
                <div className="mx-auto grid max-w-7xl items-start gap-12">
                    {features.map((feature, index) => (
                        <div key={feature.title} className={`grid gap-10 md:grid-cols-2 md:items-center ${index % 2 !== 0 ? 'md:grid-flow-col-dense' : ''}`}>
                             <div className={`space-y-4 ${index % 2 !== 0 ? 'md:col-start-2' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                                </div>
                                <p className="text-muted-foreground text-lg">
                                    {feature.description}
                                </p>
                             </div>
                             <div className={`flex justify-center ${index % 2 !== 0 ? 'md:col-start-1' : ''}`}>
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    width={550}
                                    height={412}
                                    className="rounded-xl shadow-2xl"
                                    data-ai-hint={feature.imageHint}
                                />
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>

      <footer className="border-t bg-secondary/50">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
             <Logo className="h-8 w-8" />
             <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                &copy; {new Date().getFullYear()} MediSafe. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
              prefetch={false}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-4"
              prefetch={false}
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
