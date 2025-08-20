import { AppListing } from "@/components/AppListing";
import { getApps } from "@/services/appService";
import { App } from "@/lib/types";

export default async function Home() {
  const initialApps = await getApps();
  const formattedApps = initialApps.map((app) => ({
    name: app.name,
    title: app.title,
    description: app.description,
    tags: app.tags || [],
    screenshot: app.screenshot || "",
  })) as App[];

  if (!initialApps || initialApps.length === 0) {
    return <div className="container mx-auto px-4 py-8">No apps found.</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <AppListing initialApps={formattedApps} />
    </div>
  );
}
