import fs from "fs";
import path from "path";

export interface LocalMeme {
  id: string;
  name: string;
  tags: string[];
  text: string;
  emotions: string[];
  image: string;
}

interface MemesData {
  memes: LocalMeme[];
}

let memesCache: LocalMeme[] | null = null;

function loadMemes(): LocalMeme[] {
  if (memesCache) return memesCache;

  const filePath = path.join(process.cwd(), "data", "memes.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const data: MemesData = JSON.parse(fileContent);
  memesCache = data.memes;
  return memesCache;
}

export function searchLocalMemes(
  keywords: string[],
  emotions: string[],
  limit: number = 10
): LocalMeme[] {
  const memes = loadMemes();
  const results: { meme: LocalMeme; score: number }[] = [];

  for (const meme of memes) {
    let score = 0;

    // 키워드 매칭
    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase();

      // 태그 매칭 (높은 점수)
      if (meme.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))) {
        score += 10;
      }

      // 이름 매칭
      if (meme.name.toLowerCase().includes(lowerKeyword)) {
        score += 5;
      }

      // 텍스트 매칭
      if (meme.text.toLowerCase().includes(lowerKeyword)) {
        score += 3;
      }
    }

    // 감정 매칭 (높은 점수)
    for (const emotion of emotions) {
      const lowerEmotion = emotion.toLowerCase();
      if (meme.emotions.some((e) => e.toLowerCase().includes(lowerEmotion))) {
        score += 15;
      }
    }

    if (score > 0) {
      results.push({ meme, score });
    }
  }

  // 점수순 정렬
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit).map((r) => r.meme);
}

// 개발용: 캐시 초기화
export function clearCache() {
  memesCache = null;
}
