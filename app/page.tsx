"use client";

import { useState } from "react";

interface Meme {
  id: string;
  name: string;
  image: string;
  thumbnail: string;
  tags: string[];
  source: "local" | "naver";
}

interface Analysis {
  keywords: string[];
  emotions: string[];
  searchQueries: string[];
}

interface Stats {
  local: number;
  naver: number;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [memes, setMemes] = useState<Meme[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setMemes([]);
    setStats(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "검색 중 오류가 발생했습니다.");
      }

      setAnalysis(data.analysis);
      setMemes(data.memes || []);
      setStats(data.stats || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
  };

  const localMemes = memes.filter((m) => m.source === "local");
  const naverMemes = memes.filter((m) => m.source === "naver");

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-zinc-900 dark:to-black">
      {/* 헤더 */}
      <header className="pt-16 pb-8 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          GimmeMeme
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          기분이나 상황을 알려주세요. 딱 맞는 밈을 찾아드릴게요!
        </p>
      </header>

      {/* 검색창 */}
      <main className="max-w-3xl mx-auto px-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 회의하기 싫다, 월요일 출근, 어이가 없네..."
            className="w-full px-6 py-4 text-lg rounded-full border-2 border-purple-200 focus:border-purple-500 focus:outline-none shadow-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "검색 중..." : "찾기"}
          </button>
        </form>

        {/* 추천 태그 */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {["무한도전", "슬픔", "빡침", "웃김", "당황"].map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors dark:bg-zinc-800 dark:text-purple-400 dark:hover:bg-zinc-700"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* 결과 영역 */}
        <section className="mt-12 pb-16">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              <p className="mt-4 text-zinc-500">AI가 분석하고 밈을 찾는 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-6xl mb-4">😵</p>
              <p className="text-red-500">{error}</p>
              <p className="mt-2 text-sm text-zinc-400">
                .env.local에 API 키가 설정되어 있는지 확인해주세요.
              </p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* AI 분석 결과 */}
              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-4">
                  AI 분석 결과
                </h3>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-zinc-500">감지된 감정:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {analysis.emotions.map((emotion, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm dark:bg-pink-900/30 dark:text-pink-400"
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-zinc-500">키워드:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {analysis.keywords.map((keyword, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-zinc-500">검색 쿼리:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {analysis.searchQueries.map((q, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm dark:bg-purple-900/30 dark:text-purple-400"
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 자체 DB 결과 */}
              {localMemes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full dark:bg-green-900/30 dark:text-green-400">
                      자체 DB
                    </span>
                    추천 밈 ({localMemes.length}개)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {localMemes.map((meme) => (
                      <div
                        key={meme.id}
                        className="relative aspect-square rounded-xl overflow-hidden shadow-lg bg-zinc-100 dark:bg-zinc-800 border-2 border-green-300 dark:border-green-700"
                      >
                        <div className="w-full h-full flex items-center justify-center p-4 text-center">
                          <div>
                            <p className="text-4xl mb-2">🎬</p>
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              {meme.name}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2 justify-center">
                              {meme.tags.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">
                    * 자체 DB 밈은 실제 이미지 대신 플레이스홀더로 표시됩니다. 이미지를 추가하면 표시됩니다.
                  </p>
                </div>
              )}

              {/* Naver 검색 결과 */}
              {naverMemes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                      Naver
                    </span>
                    검색 결과 ({naverMemes.length}개)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {naverMemes.map((meme) => (
                      <a
                        key={meme.id}
                        href={meme.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer group bg-zinc-100 dark:bg-zinc-800"
                      >
                        <img
                          src={meme.thumbnail}
                          alt={meme.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = meme.image;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium line-clamp-2">
                            {meme.name}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 결과 없음 */}
              {memes.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-zinc-500">
                    검색 결과가 없어요. 다른 검색어를 시도해보세요!
                  </p>
                </div>
              )}

              {/* 통계 */}
              {stats && (
                <div className="text-center text-sm text-zinc-400">
                  자체 DB: {stats.local}개 / Naver: {stats.naver}개
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-6xl mb-4">👆</p>
              <p className="text-zinc-500">
                위에 기분이나 상황을 입력해보세요!
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
