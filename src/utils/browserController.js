export const executeBrowserCommand = async (command, onUrlChange, currentUrl) => {
  try {
    console.log('Executing browser command:', command)
    
    switch (command.action) {
      case 'navigate':
        if (command.url) {
          console.log('Navigating to:', command.url)
          onUrlChange(command.url)
        }
        break
        
      case 'search':
        if (command.query) {
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(command.query)}`
          console.log('Searching for:', command.query, 'URL:', searchUrl)
          onUrlChange(searchUrl)
        }
        break
        
      case 'refresh':
        // 현재 URL로 다시 이동하여 새로고침 효과
        console.log('Refreshing current page:', currentUrl)
        onUrlChange(currentUrl + (currentUrl.includes('?') ? '&' : '?') + 'refresh=' + Date.now())
        break
        
      case 'back':
        // 뒤로가기는 브라우저 히스토리를 통해 처리
        console.log('Going back in history')
        // 이 부분은 BrowserViewer 컴포넌트에서 처리하도록 신호 전송
        return { action: 'back' }
        
      default:
        console.log('Unknown command:', command)
    }
    
    return { action: command.action, success: true }
  } catch (error) {
    console.error('Error executing browser command:', error)
    return { action: command.action, success: false, error: error.message }
  }
}

export const getPopularUrls = () => {
  return [
    {
      name: '구글',
      url: 'https://www.google.com',
      icon: '🔍'
    },
    {
      name: '유튜브',
      url: 'https://www.youtube.com',
      icon: '📺'
    },
    {
      name: '네이버',
      url: 'https://www.naver.com',
      icon: '🌐'
    },
    {
      name: '깃허브',
      url: 'https://github.com',
      icon: '💻'
    },
    {
      name: '위키피디아',
      url: 'https://wikipedia.org',
      icon: '📚'
    }
  ]
}

export const formatUrl = (url) => {
  if (!url) return ''
  
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url
  }
  
  return url
}

export const extractDomain = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch (error) {
    return url
  }
}

export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

export const getSuggestedCommands = () => {
  return [
    {
      text: '구글로 가줘',
      description: '구글 홈페이지로 이동'
    },
    {
      text: '파이썬 검색해줘',
      description: '파이썬 관련 검색'
    },
    {
      text: '유튜브 열어줘',
      description: '유튜브 사이트로 이동'
    },
    {
      text: '새로고침해줘',
      description: '현재 페이지 새로고침'
    },
    {
      text: '뒤로가기',
      description: '이전 페이지로 이동'
    }
  ]
} 