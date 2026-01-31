# GimmeMeme

감정, 상황, 기분을 입력하면 AI가 딱 맞는 밈/짤을 찾아주는 웹앱

## Features

- 자연어로 기분/상황 입력 → AI가 분석
- 한국 밈(무한도전 등) 특화
- 자체 DB + 외부 검색 하이브리드 방식

## Tech Stack

| 영역 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite → PostgreSQL |
| AI | Claude API |
| Image Search | Naver Search API |

## Project Structure

```
gimme-meme/
├── app/
│   ├── page.tsx              # 메인 검색 페이지
│   └── api/
│       ├── search/           # AI + 이미지 검색 API
│       └── meme/             # 자체 DB 조회
├── lib/
│   ├── claude.ts             # Claude API 연동
│   ├── naver.ts              # Naver 이미지 검색
│   └── db.ts                 # 밈 DB 관리
├── data/
│   └── memes.json            # 자체 밈 데이터
└── public/
    └── memes/                # 로컬 밈 이미지
```

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인

## Environment Variables

`.env.local` 파일을 생성하고 아래 내용을 입력하세요:

```env
CLAUDE_API_KEY=your_claude_api_key
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

## License

MIT
