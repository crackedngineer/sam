import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppById } from "@/services/appService";
import { Button } from "@/components/ui/button";
// import { ThemeToggle } from '@/components/theme-toggle';
import { ChevronLeft, ExternalLink, Rocket } from "lucide-react";

export default async function AppView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: appId } = await params;
  const app = await getAppById(appId);
  if (!app) {
    notFound();
  }
  const formatApp = {
    name: app.name,
    title: app.title,
    description: app.description,
    tags: app.tags || [],
    screenshot: app.screenshot || "",
  };
  const appUrl = `${process.env.NEXT_PUBLIC_STREAMLIT_APPS_BASE_URL}?embed=true&page=${app?.name}`;

  return (
    <div className="flex h-screen w-screen flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6">
        <div className="flex flex-1 items-center gap-2 sm:gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to home</span>
            </Link>
          </Button>
          <Link href="/" className="hidden items-center gap-2 font-semibold sm:flex">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="text-lg font-headline">App Hub</span>
          </Link>
          <span className="hidden text-lg text-muted-foreground sm:block">/</span>
          <h1 className="truncate text-base font-semibold sm:text-lg">{String(formatApp.title)}</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="outline" size="sm" asChild>
            <a href={appUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Open in New Tab</span>
              <span className="inline sm:hidden">Open</span>
            </a>
          </Button>
          {/* <ThemeToggle /> */}
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <iframe
          src={appUrl}
          className="h-full w-full border-0"
          title={String(formatApp.title)}
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>
      </main>
    </div>
  );
}
