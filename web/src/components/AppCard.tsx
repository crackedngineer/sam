import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { App } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Link href={`/app/${app.name}`} className="block h-full">
      <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 dark:hover:shadow-primary/10">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline text-xl font-bold">
              {app.title}
            </CardTitle>
            <CardDescription className="pt-1 text-base">
              {app.description}
            </CardDescription>
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="aspect-video overflow-hidden rounded-md border">
            <Image
              src={app.screenshot}
              alt={`Screenshot of ${app.title}`}
              width={600}
              height={400}
              className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              //   data-ai-hint={app.screenshotHint}
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {app.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="font-normal text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
