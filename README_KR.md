# NeoNeon Tribe 웹 한글패치 시작 파일

## 구성
- `tribe_story_kr.user.js` : Tampermonkey용 메인 스크립트
- `translations/common.json` : 공통 이름/용어 치환
- `translations/story4-1.json` : story4-1 전용 치환

## GitHub Pages로 올리는 방법
1. GitHub에서 새 public 저장소 생성
   - 예: `tribe-nine-kr`
2. 이 파일들을 그대로 업로드
3. GitHub 저장소의 `Settings > Pages`로 이동
4. Source를 `Deploy from a branch`로 선택
5. Branch를 `main`, Folder를 `/ (root)`로 선택
6. 저장
7. 잠시 후 사이트 주소가 생성됨
   - 예: `https://YOUR_GITHUB_USERNAME.github.io/tribe-nine-kr/`

GitHub Pages는 public 저장소에서 쓸 수 있고, branch나 `/docs` 폴더를 게시 원본으로 설정할 수 있습니다. 
공식 문서: GitHub Pages 빠른 시작 / 게시 소스 구성

## Tampermonkey 설정
1. `tribe_story_kr.user.js` 파일을 열기
2. 아래 줄을 자신의 주소로 수정

```js
const BASE_URL = 'https://YOUR_GITHUB_USERNAME.github.io/tribe-nine-kr';
```

예:
```js
const BASE_URL = 'https://myname.github.io/tribe-nine-kr';
```

3. Tampermonkey 새 스크립트에 붙여넣고 저장
4. `https://neoneon-tribe.com/story/story4-1/` 접속 후 새로고침

## 다음 페이지 추가 방법
1. `translations/story4-2.json` 파일 만들기
2. 아래 형식으로 추가

```json
[
  ["일본어 원문", "한국어 번역"],
  ["일본어 원문2", "한국어 번역2"]
]
```

3. GitHub에 업로드
4. 몇 초 뒤 자동 반영

## 팁
- 긴 문장부터 넣는 편이 안전함
- 이름/공통 용어는 `common.json`에만 넣기
- 페이지마다 다른 대사는 각 페이지 JSON으로 분리
