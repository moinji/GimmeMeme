import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export interface AnalysisResult {
  keywords: string[];
  emotions: string[];
  searchQueries: string[];
}

export async function analyzeUserInput(input: string): Promise<AnalysisResult> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `사용자가 밈/짤을 찾기 위해 다음과 같이 입력했습니다: "${input}"

이 입력을 분석해서 적절한 밈을 찾을 수 있도록 도와주세요.

다음 JSON 형식으로만 응답해주세요:
{
  "keywords": ["키워드1", "키워드2"],
  "emotions": ["감정1", "감정2"],
  "searchQueries": ["검색어1", "검색어2", "검색어3"]
}

- keywords: 입력에서 추출한 핵심 키워드 (한국어)
- emotions: 감지된 감정/기분 (예: 짜증, 슬픔, 기쁨, 황당, 피곤 등)
- searchQueries: 한국 밈/짤을 찾기 위한 검색어 (무한도전, 유재석, 박명수 등 관련 키워드 포함). 최대 5개.

예시:
입력: "회사 가기 싫어"
{
  "keywords": ["회사", "출근", "싫음"],
  "emotions": ["귀찮음", "피곤", "우울"],
  "searchQueries": ["월요병 짤", "출근 싫어 짤", "무한도전 회사 짤", "퇴근하고싶다 짤", "직장인 공감 짤"]
}

JSON만 출력하세요.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  try {
    const result = JSON.parse(content.text);
    return result as AnalysisResult;
  } catch {
    // JSON 파싱 실패 시 기본값 반환
    return {
      keywords: [input],
      emotions: [],
      searchQueries: [`${input} 짤`, `${input} 밈`],
    };
  }
}
