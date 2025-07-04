# Browser Chat 🌐💬

**AI 채팅으로 브라우저를 제어하는 혁신적인 웹 서비스**

채팅 인터페이스를 통해 자연어 명령으로 브라우저를 제어할 수 있는 심플하고 직관적인 웹 애플리케이션입니다.

## ✨ 주요 기능

- 🤖 **AI 브라우저 제어**: OpenAI GPT를 활용한 자연어 명령 처리
- 🌐 **실시간 브라우저 뷰어**: iframe 기반 웹페이지 표시
- 💬 **직관적인 채팅 UI**: 친근한 대화형 인터페이스
- 🔒 **안전한 API 키 관리**: 로컬 스토리지 기반 보안 저장
- 📱 **반응형 디자인**: 모든 기기에서 완벽한 사용자 경험

## 🚀 데모

[GitHub Pages에서 체험하기](https://[username].github.io/browser-chat)

## 📋 사용 예시

```
사용자: "구글로 가줘"
AI: "구글로 이동하겠습니다!" → https://www.google.com

사용자: "파이썬 검색해줘"
AI: "파이썬을 검색하겠습니다!" → Google 검색 결과

사용자: "유튜브 열어줘"
AI: "유튜브로 이동하겠습니다!" → https://www.youtube.com

사용자: "새로고침해줘"
AI: "페이지를 새로고침하겠습니다!" → 현재 페이지 새로고침
```

## 🛠️ 기술 스택

### Frontend
- **React 18** - 컴포넌트 기반 UI 라이브러리
- **Vite** - 빠른 개발 환경 및 빌드 도구
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **Lucide React** - 아이콘 라이브러리

### AI & API
- **OpenAI GPT-3.5-turbo** - 자연어 처리 및 명령 해석
- **OpenAI JavaScript SDK** - 클라이언트 사이드 API 통신

### 배포
- **GitHub Pages** - 정적 사이트 호스팅
- **GitHub Actions** - 자동 배포 파이프라인

## 🔧 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone https://github.com/[username]/browser-chat.git
cd browser-chat
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 빌드 및 배포
```bash
npm run build
npm run deploy
```

## 🔑 OpenAI API 키 설정

1. [OpenAI Platform](https://platform.openai.com/)에서 계정 생성
2. API 키 발급 (유료 계정 필요)
3. 애플리케이션 실행 후 설정 버튼 클릭
4. 발급받은 API 키 입력

> ⚠️ **보안 주의사항**: API 키는 브라우저 로컬 스토리지에만 저장되며, 외부로 전송되지 않습니다.

## 📁 프로젝트 구조

```
browser-chat/
├── public/
│   ├── favicon.svg          # 사이트 아이콘
│   └── index.html           # 메인 HTML
├── src/
│   ├── components/
│   │   ├── Chat.jsx         # 채팅 인터페이스
│   │   ├── BrowserViewer.jsx # 브라우저 뷰어
│   │   └── ApiKeyModal.jsx  # API 키 설정 모달
│   ├── utils/
│   │   ├── openai.js        # OpenAI API 통신
│   │   └── browserController.js # 브라우저 제어 로직
│   ├── App.jsx              # 메인 애플리케이션
│   ├── main.jsx             # 진입점
│   └── index.css            # 전역 스타일
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 지원 명령어

### 네비게이션
- `"구글로 가줘"`, `"유튜브 열어줘"`, `"네이버로 이동"`
- `"github.com으로 가줘"`, `"위키피디아 열어줘"`

### 검색
- `"파이썬 검색해줘"`, `"리액트 찾아줘"`
- `"날씨 검색"`, `"뉴스 보여줘"`

### 브라우저 제어
- `"새로고침해줘"`, `"페이지 새로고침"`
- `"뒤로가기"`, `"이전 페이지"`

## 🌟 주요 특징

### 1. 자연어 처리
- GPT-3.5-turbo를 활용한 정확한 명령 해석
- 한국어 자연어 명령 완벽 지원
- 컨텍스트 기반 스마트 응답

### 2. 실시간 브라우저 제어
- iframe 기반 안전한 웹페이지 표시
- 실시간 URL 변경 및 네비게이션
- 브라우저 히스토리 관리

### 3. 사용자 친화적 UI
- 직관적인 채팅 인터페이스
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- 부드러운 애니메이션과 트랜지션

### 4. 보안 및 개인정보
- 클라이언트 사이드 API 키 관리
- 로컬 스토리지 기반 안전한 저장
- 외부 서버 없이 완전한 프론트엔드 구현

## 🔄 업데이트 내역

### v1.1.0 (2024-01-XX)
- **OpenAI API 완전 통합**: 모든 명령 처리를 AI가 담당
- **JSON 응답 강제**: 더 안정적인 명령 파싱 (response_format 설정)
- **응답 일관성 향상**: temperature 0.3으로 설정하여 더 정확한 명령 해석
- **프롬프트 엔지니어링 개선**: 더 상세한 시스템 프롬프트로 명령 인식 정확도 향상
- **주요 웹사이트 매핑**: 네이버, 다음, 깃허브, 위키피디아 등 주요 사이트 URL 자동 매핑
- **텍스트 명령 추출 함수 제거**: AI가 모든 명령을 판단하도록 단순화
- **프로젝트 구조 정리**: .gitignore 파일 추가로 불필요한 파일 제외

### v1.0.0 (2024-01-XX)
- 초기 버전 출시
- AI 채팅 기반 브라우저 제어 기능
- GitHub Pages 배포 지원
- OpenAI API 통합

## 🤝 기여하기

1. 프로젝트를 Fork 해주세요
2. 새로운 기능 브랜치를 생성해주세요 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋해주세요 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push 해주세요 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성해주세요

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 확인해주세요.

## 📞 문의

- 개발자: [Your Name]
- 이메일: [your-email@example.com]
- 프로젝트 링크: [https://github.com/[username]/browser-chat](https://github.com/[username]/browser-chat)

---

⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!