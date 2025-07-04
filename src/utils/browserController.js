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
          const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(command.query)}`
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
      name: 'Bing Search',
      url: 'https://www.bing.com',
      icon: '🔍'
    },
    {
      name: 'DuckDuckGo',
      url: 'https://duckduckgo.com',
      icon: '🦆'
    },
    {
      name: 'Wikipedia',
      url: 'https://wikipedia.org',
      icon: '📚'
    },
    {
      name: 'BBC News',
      url: 'https://www.bbc.com',
      icon: '📰'
    },
    {
      name: 'Stack Overflow',
      url: 'https://stackoverflow.com',
      icon: '💻'
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
      text: 'Go to Bing',
      description: 'Navigate to Bing search engine'
    },
    {
      text: 'Search for Python',
      description: 'Search for Python programming'
    },
    {
      text: 'Open Wikipedia',
      description: 'Navigate to Wikipedia'
    },
    {
      text: 'Refresh page',
      description: 'Refresh current page'
    },
    {
      text: 'Go back',
      description: 'Go to previous page'
    }
  ]
} 