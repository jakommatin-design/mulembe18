import { MetadataRoute } from "next";
import { chapterRepository } from "@/server/repositories/chapter.repository";
import { eventRepository } from "@/server/repositories/event.repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mulembe.org";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chapters`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/design-system`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Dynamic chapter routes
  let dynamicChapterRoutes: MetadataRoute.Sitemap = [];
  try {
    const chapters = await chapterRepository.getAllActive();
    dynamicChapterRoutes = chapters.map((ch) => ({
      url: `${baseUrl}/chapters/${ch.slug}`,
      lastModified: ch.updatedAt || ch.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.warn("Failed to fetch chapters for sitemap:", error);
  }

  // Dynamic event routes
  let dynamicEventRoutes: MetadataRoute.Sitemap = [];
  try {
    const { items: events } = await eventRepository.list({
      status: "published",
      limit: 100,
    });
    dynamicEventRoutes = events.map((ev) => ({
      url: `${baseUrl}/events/${ev.slug}`,
      lastModified: ev.updatedAt || ev.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.warn("Failed to fetch events for sitemap:", error);
  }

  return [...staticRoutes, ...dynamicChapterRoutes, ...dynamicEventRoutes];
}

