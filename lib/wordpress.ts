import { WPPost } from "@/types/wordpress";

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function getPosts(limit: number = 10): Promise<WPPost[]> {
  if (!WP_API_URL) {
    console.error("NEXT_PUBLIC_WORDPRESS_URL is not defined");
    return [];
  }

  try {
    const fields = "id,slug,title,excerpt,date,modified,_links,_embedded";
    const url = `${WP_API_URL}/posts?_embed=wp:featuredmedia,author&_fields=${fields}&orderby=date&order=desc&per_page=${limit}`;

    const res = await fetch(url, {
      next: { revalidate: 3600, tags: ["posts"] },
      cache: "force-cache",
    });

    if (!res.ok) {
      console.error(`Failed to fetch WordPress posts: ${res.status} ${res.statusText}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching WordPress posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  if (!WP_API_URL) return null;

  try {
    // Note: getPostBySlug needs full content, so we let _embed pull what it needs, but we could restrict _fields too.
    const res = await fetch(`${WP_API_URL}/posts?_embed=wp:featuredmedia,author&slug=${slug}`, {
      next: { revalidate: 3600 },
      cache: "force-cache",
    });

    if (!res.ok) {
      console.error(`Failed to fetch WordPress post (${slug}): ${res.status} ${res.statusText}`);
      return null;
    }

    const posts: WPPost[] = await res.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Error fetching WordPress post (${slug}):`, error);
    return null;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (!WP_API_URL) return [];

  try {
    const res = await fetch(`${WP_API_URL}/posts?_fields=slug&per_page=100`, {
      next: { revalidate: 3600 },
      cache: "force-cache",
    });

    if (!res.ok) return [];

    const posts: { slug: string }[] = await res.json();
    return posts.map((post) => post.slug);
  } catch (error) {
    console.error("Error fetching WordPress slugs:", error);
    return [];
  }
}
