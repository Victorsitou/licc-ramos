import { useEffect, useState } from "react";
import { Resource, getResource } from "../services/resources";

export function useExtraResources(slug: string): Resource[] | null {
  const [resources, setResources] = useState<Resource[] | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      if (!slug) {
        return;
      }

      const fetchedResources = await getResource({ slug, type: "EXTRA" });
      if (fetchedResources.length === 0) {
        setResources(null);
      } else {
        setResources(fetchedResources);
      }
    };

    fetchResources();
  }, [slug]);

  return resources;
}
