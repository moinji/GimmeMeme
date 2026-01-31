export interface NaverImage {
  title: string;
  link: string;
  thumbnail: string;
  sizeheight: string;
  sizewidth: string;
}

export interface NaverSearchResult {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverImage[];
}

export async function searchImages(query: string, display: number = 10): Promise<NaverImage[]> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Naver API credentials not configured");
  }

  const url = new URL("https://openapi.naver.com/v1/search/image");
  url.searchParams.set("query", query);
  url.searchParams.set("display", display.toString());
  url.searchParams.set("sort", "sim"); // 유사도순

  const response = await fetch(url.toString(), {
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
  });

  if (!response.ok) {
    throw new Error(`Naver API error: ${response.status}`);
  }

  const data: NaverSearchResult = await response.json();
  return data.items;
}

export async function searchMultipleQueries(queries: string[], imagesPerQuery: number = 5): Promise<NaverImage[]> {
  const results: NaverImage[] = [];
  const seenLinks = new Set<string>();

  for (const query of queries) {
    try {
      const images = await searchImages(query, imagesPerQuery);

      for (const image of images) {
        // 중복 제거
        if (!seenLinks.has(image.link)) {
          seenLinks.add(image.link);
          results.push(image);
        }
      }
    } catch (error) {
      console.error(`Error searching for "${query}":`, error);
    }
  }

  return results;
}
