import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { App } from "@/lib/types";
import { ArrowRight, Rocket } from "lucide-react";

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Link href={`/app/${app.name}`} className="group block h-full">
      <Card className="py-0 gap-0 flex h-full flex-col rounded-xl border-border/50 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:border-primary/50 dark:hover:shadow-primary/10">
        <CardHeader className="p-5">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground transition-transform duration-300 group-hover:text-primary group-hover:translate-x-1">
              <span>View App</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col p-5 pt-0">
          <CardTitle className="font-headline text-xl font-bold leading-tight">
            {app.title}
          </CardTitle>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {app.description}
          </p>
        </CardContent>
        <CardFooter className="mt-auto flex-wrap gap-2 p-5 pt-0">
          {app.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-md font-normal text-xs"
            >
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
