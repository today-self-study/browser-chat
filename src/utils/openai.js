import OpenAI from 'openai'

export const sendToOpenAI = async (message, apiKey, currentUrl) => {
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // 클라이언트 사이드에서 사용하기 위해 필요
    })

    const systemPrompt = `
당신은 브라우저 제어 AI 어시스턴트입니다. 사용자의 자연어 명령을 받아 브라우저 액션으로 변환해야 합니다.

현재 URL: ${currentUrl}

사용자의 명령을 분석하고 다음 중 하나의 액션을 수행하세요:

1. URL 변경 (navigate): 특정 웹사이트로 이동
2. 검색 (search): 검색 엔진에서 검색
3. 새로고침 (refresh): 현재 페이지 새로고침
4. 뒤로가기 (back): 이전 페이지로 이동
5. 일반 응답 (response): 브라우저 제어가 아닌 일반적인 대화

응답 형식:
{
  "action": "navigate|search|refresh|back|response",
  "url": "실제 URL (action이 navigate나 search일 때만)",
  "query": "검색어 (action이 search일 때만)",
  "message": "사용자에게 보여줄 친근한 응답 메시지"
}

예시:
- "구글로 가줘" → {"action": "navigate", "url": "https://www.google.com", "message": "구글로 이동하겠습니다!"}
- "파이썬 검색해줘" → {"action": "search", "query": "파이썬", "url": "https://www.google.com/search?q=파이썬", "message": "파이썬을 검색하겠습니다!"}
- "새로고침해줘" → {"action": "refresh", "message": "페이지를 새로고침하겠습니다!"}
- "뒤로가기" → {"action": "back", "message": "이전 페이지로 이동하겠습니다!"}
- "안녕하세요" → {"action": "response", "message": "안녕하세요! 어떤 웹사이트를 방문하거나 검색하고 싶으신가요?"}
`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    const aiResponse = response.choices[0].message.content

    try {
      const parsedResponse = JSON.parse(aiResponse)
      
      return {
        message: parsedResponse.message,
        command: parsedResponse.action !== 'response' ? parsedResponse : null
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return {
        message: aiResponse,
        command: null
      }
    }

  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('OpenAI API 호출에 실패했습니다. API 키를 확인해주세요.')
  }
}

export const validateApiKey = (apiKey) => {
  if (!apiKey || typeof apiKey !== 'string') {
    return false
  }
  
  return apiKey.startsWith('sk-') && apiKey.length > 20
} 