import OpenAI from 'openai'

export const sendToOpenAI = async (message, apiKey, currentUrl) => {
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // 클라이언트 사이드에서 사용하기 위해 필요
      baseURL: 'https://api.openai.com/v1'
    })

    const systemPrompt = `
You are a browser control AI assistant. You receive natural language commands from users and convert them into browser actions.

Current URL: ${currentUrl}

**Important: You must respond ONLY in valid JSON format. Do not include any other text.**

**Language Response Rule: Always respond in the same language as the user's input. If the user types in Korean, respond in Korean. If in English, respond in English. If in Japanese, respond in Japanese, etc.**

Analyze the user's command and perform one of the following actions:

1. URL change (navigate): Navigate to a specific website
2. Search (search): Search on search engines
3. Refresh (refresh): Refresh current page
4. Go back (back): Navigate to previous page
5. General response (response): General conversation not related to browser control

Response Format (JSON only):
{
  "action": "navigate|search|refresh|back|response",
  "url": "actual URL (only when action is navigate or search)",
  "query": "search query (only when action is search)",
  "message": "friendly response message to show to user"
}

Examples:
- "Go to Google" → {"action": "navigate", "url": "https://www.google.com", "message": "Going to Google!"}
- "Search for Python" → {"action": "search", "query": "Python", "url": "https://www.google.com/search?q=Python", "message": "Searching for Python!"}
- "구글로 가줘" → {"action": "navigate", "url": "https://www.google.com", "message": "구글로 이동하겠습니다!"}
- "파이썬 검색해줘" → {"action": "search", "query": "파이썬", "url": "https://www.google.com/search?q=파이썬", "message": "파이썬을 검색하겠습니다!"}
- "YouTube 열어줘" → {"action": "navigate", "url": "https://www.youtube.com", "message": "YouTube로 이동하겠습니다!"}
- "Refresh the page" → {"action": "refresh", "message": "Refreshing the page!"}
- "뒤로가기" → {"action": "back", "message": "이전 페이지로 이동하겠습니다!"}
- "Hello" → {"action": "response", "message": "Hello! Which website would you like to visit or what would you like to search for?"}
- "안녕하세요" → {"action": "response", "message": "안녕하세요! 어떤 웹사이트를 방문하거나 검색하고 싶으신가요?"}

Recognize major website names (Google, YouTube, GitHub, Wikipedia, Naver, Daum, etc.) and generate navigation commands to their URLs.
For commands containing search terms, automatically generate Google search URLs.
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
      max_tokens: 300,
      temperature: 0.3,
      response_format: { type: "json_object" }
    })

    const aiResponse = response.choices[0].message.content

    try {
      const parsedResponse = JSON.parse(aiResponse)
      console.log('Parsed OpenAI response:', parsedResponse)
      
      return {
        message: parsedResponse.message || aiResponse,
        command: parsedResponse.action !== 'response' ? parsedResponse : null
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.log('Raw AI response:', aiResponse)
      
      // JSON 파싱 실패 시 기본 응답만 반환
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