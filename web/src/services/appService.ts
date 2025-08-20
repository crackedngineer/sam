const GITHUB_JSON_URL =
  "https://raw.githubusercontent.com/crackedngineer/sam/refs/heads/master/apps/apps_list.json";

export type App = {
  name: string;
  description?: string;
  [key: string]: unknown;
};

export const getApps = async (): Promise<App[]> => {
  try {
    const res = await fetch(GITHUB_JSON_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch apps: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as App[];
  } catch (error) {
    console.error("Error fetching apps:", error);
    return [];
  }
};

export const getAppById = async (id: string): Promise<App | undefined> => {
  try {
    const apps = await getApps();
    return apps.find(app => app.name === id);
  } catch (error) {
    console.error("Error fetching app by id:", error);
    return undefined;
  }
};
