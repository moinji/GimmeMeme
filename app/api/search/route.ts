import { NextRequest, NextResponse } from "next/server";
import { analyzeUserInput } from "@/lib/claude";
import { searchMultipleQueries, NaverImage } from "@/lib/naver";
import { searchLocalMemes, LocalMeme } from "@/lib/db";

interface Meme {
  id: string;
  name: string;
  image: string;
  thumbnail: string;
  tags: string[];
  source: "local" | "naver";
}

function convertNaverToMemes(images: NaverImage[]): Meme[] {
  return images.map((img, index) => ({
    id: `naver-${index}-${Date.now()}`,
    name: img.title.replace(/<[^>]*>/g, ""),
    image: img.link,
    thumbnail: img.thumbnail,
    tags: [],
    source: "naver" as const,
  }));
}

function convertLocalToMemes(localMemes: LocalMeme[]): Meme[] {
  return localMemes.map((meme) => ({
    id: meme.id,
    name: meme.name,
    image: meme.image,
    thumbnail: meme.image,
    tags: meme.tags,
    source: "local" as const,
  }));
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "검색어를 입력해주세요." },
        { status: 400 }
      );
    }

    // Claude로 사용자 입력 분석
    const analysis = await analyzeUserInput(query);

    // 1. 자체 DB에서 먼저 검색
    const localResults = searchLocalMemes(
      analysis.keywords,
      analysis.emotions,
      10
    );
    const localMemes = convertLocalToMemes(localResults);

    // 2. Naver 이미지 검색
    let naverMemes: Meme[] = [];
    try {
      const images = await searchMultipleQueries(analysis.searchQueries, 5);
      naverMemes = convertNaverToMemes(images);
    } catch (error) {
      console.error("Naver search error:", error);
    }

    // 3. 결과 합치기 (자체 DB 우선)
    const allMemes = [...localMemes, ...naverMemes];

    return NextResponse.json({
      success: true,
      query,
      analysis,
      memes: allMemes,
      stats: {
        local: localMemes.length,
        naver: naverMemes.length,
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
