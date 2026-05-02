import { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://jyotirvedantagurukulam.in";

  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/courses",
    "/ebooks",
    "/kundli",
    "/horoscope",
    "/chat",
    "/services",
    "/blog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic blog post routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllPostSlugs();
    blogRoutes = slugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error generating sitemap for blog posts:", error);
  }

  return [...staticRoutes, ...blogRoutes];
}
