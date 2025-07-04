import React, { useState, useRef, useEffect } from 'react'
import { RefreshCw, ArrowLeft, ArrowRight, Home, ExternalLink, AlertCircle, Globe } from 'lucide-react'

const BrowserViewer = ({ url, onUrlChange }) => {
  const [currentUrl, setCurrentUrl] = useState(url)
  const [isLoading, setIsLoading] = useState(false)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const iframeRef = useRef(null)
  const historyRef = useRef([url])
  const historyIndexRef = useRef(0)

  // iframe으로 로드할 수 없는 사이트들
  const blockedSites = [
    'google.com',
    'youtube.com',
    'facebook.com',
    'twitter.com',
    'instagram.com',
    'linkedin.com',
    'github.com',
    'stackoverflow.com'
  ]

  // iframe 친화적인 대안 사이트들
  const alternativeSites = {
    'google.com': 'https://duckduckgo.com',
    'youtube.com': 'https://invidious.io',
    'twitter.com': 'https://nitter.net',
    'instagram.com': 'https://picuki.com',
    'github.com': 'https://github1s.com'
  }

  useEffect(() => {
    setCurrentUrl(url)
    setHasError(false)
  }, [url])

  const checkIfSiteBlocked = (url) => {
    return blockedSites.some(site => url.toLowerCase().includes(site))
  }

  const getAlternativeUrl = (url) => {
    const site = blockedSites.find(site => url.toLowerCase().includes(site))
    return alternativeSites[site] || null
  }

  const handleUrlSubmit = (e) => {
    e.preventDefault()
    navigateToUrl(currentUrl)
  }

  const navigateToUrl = (newUrl) => {
    setIsLoading(true)
    setHasError(false)
    
    // URL 형식 정규화
    let formattedUrl = newUrl
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl
    }
    
    // 차단된 사이트 확인
    if (checkIfSiteBlocked(formattedUrl)) {
      setIsLoading(false)
      setHasError(true)
      setErrorMessage('This site cannot be loaded in iframe due to security restrictions.')
      return
    }
    
    // 히스토리 업데이트
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
    historyRef.current.push(formattedUrl)
    historyIndexRef.current = historyRef.current.length - 1
    
    updateNavigationButtons()
    
    setCurrentUrl(formattedUrl)
    onUrlChange(formattedUrl)
    
    // 로딩 상태 관리
    setTimeout(() => setIsLoading(false), 3000)
  }

  const updateNavigationButtons = () => {
    setCanGoBack(historyIndexRef.current > 0)
    setCanGoForward(historyIndexRef.current < historyRef.current.length - 1)
  }

  const goBack = () => {
    if (canGoBack) {
      historyIndexRef.current--
      const previousUrl = historyRef.current[historyIndexRef.current]
      setCurrentUrl(previousUrl)
      onUrlChange(previousUrl)
      updateNavigationButtons()
    }
  }

  const goForward = () => {
    if (canGoForward) {
      historyIndexRef.current++
      const nextUrl = historyRef.current[historyIndexRef.current]
      setCurrentUrl(nextUrl)
      onUrlChange(nextUrl)
      updateNavigationButtons()
    }
  }

  const goHome = () => {
    navigateToUrl('https://www.bing.com')
  }

  const refresh = () => {
    setIsLoading(true)
    setHasError(false)
    if (iframeRef.current) {
      const refreshUrl = currentUrl + (currentUrl.includes('?') ? '&' : '?') + 'refresh=' + Date.now()
      iframeRef.current.src = refreshUrl
    }
    setTimeout(() => setIsLoading(false), 3000)
  }

  const openInNewTab = () => {
    window.open(currentUrl, '_blank')
  }

  const tryAlternative = () => {
    const alternativeUrl = getAlternativeUrl(currentUrl)
    if (alternativeUrl) {
      navigateToUrl(alternativeUrl)
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
    setErrorMessage('Failed to load the website. The site may block iframe access.')
  }

  return (
    <div className="flex flex-col h-full">
      {/* 브라우저 툴바 */}
      <div className="bg-gray-100 border-b border-gray-300 p-3">
        <div className="flex items-center space-x-2">
          {/* 네비게이션 버튼 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={goBack}
              disabled={!canGoBack}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goForward}
              disabled={!canGoForward}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Go Forward"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={refresh}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* 주소창 */}
          <form onSubmit={handleUrlSubmit} className="flex-1">
            <input
              type="text"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter website URL..."
            />
          </form>

          {/* 추가 버튼 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={goHome}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              title="Go Home"
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              onClick={openInNewTab}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 브라우저 컨텐츠 */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-600">Loading...</span>
            </div>
          </div>
        )}
        
        {hasError ? (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center p-8 max-w-md">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Blocked</h3>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <p className="text-sm text-gray-500 mb-6">
                Many websites block iframe access for security reasons. This includes sites like Google, YouTube, Facebook, and others.
              </p>
              <div className="space-y-2">
                <button
                  onClick={openInNewTab}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in New Tab</span>
                </button>
                {getAlternativeUrl(currentUrl) && (
                  <button
                    onClick={tryAlternative}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Try Alternative</span>
                  </button>
                )}
                <button
                  onClick={() => navigateToUrl('https://www.bing.com')}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go to Bing Search
                </button>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-0"
            title="Browser Viewer"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}
      </div>
    </div>
  )
}

export default BrowserViewer 