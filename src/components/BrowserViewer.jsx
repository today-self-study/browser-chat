import React, { useState, useRef, useEffect } from 'react'
import { RefreshCw, ArrowLeft, ArrowRight, Home, ExternalLink, AlertCircle, Globe, Camera, Monitor } from 'lucide-react'
import { ScreenshotProxy } from '../utils/screenshotProxy'

const BrowserViewer = ({ url, onUrlChange, viewMode: initialViewMode = 'iframe', onViewModeChange }) => {
  const [currentUrl, setCurrentUrl] = useState(url)
  const [isLoading, setIsLoading] = useState(false)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [viewMode, setViewMode] = useState(initialViewMode) // 'iframe' | 'screenshot'
  const [screenshotUrl, setScreenshotUrl] = useState(null)
  const [isScreenshotLoading, setIsScreenshotLoading] = useState(false)
  const iframeRef = useRef(null)
  const historyRef = useRef([url])
  const historyIndexRef = useRef(0)
  const screenshotProxy = useRef(new ScreenshotProxy())

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
    setScreenshotUrl(null)
  }, [url])

  // viewMode 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    if (onViewModeChange) {
      onViewModeChange(viewMode)
    }
  }, [viewMode, onViewModeChange])

  // initialViewMode 변경 시 로컬 상태 동기화
  useEffect(() => {
    setViewMode(initialViewMode)
  }, [initialViewMode])

  const checkIfSiteBlocked = (url) => {
    return blockedSites.some(site => url.toLowerCase().includes(site))
  }

  const getAlternativeUrl = (url) => {
    const site = blockedSites.find(site => url.toLowerCase().includes(site))
    return alternativeSites[site] || null
  }

  const captureScreenshot = async (targetUrl) => {
    setIsScreenshotLoading(true)
    setHasError(false)
    
    try {
      // 캐시된 스크린샷 확인
      const cachedScreenshot = screenshotProxy.current.getCachedScreenshot(targetUrl)
      if (cachedScreenshot) {
        setScreenshotUrl(cachedScreenshot)
        setViewMode('screenshot')
        setIsScreenshotLoading(false)
        return
      }
      
      // 새로운 스크린샷 캡처
      const screenshotUrl = await screenshotProxy.current.captureScreenshot(targetUrl, {
        service: 'PagePeeker',
        fallback: true
      })
      
      if (screenshotUrl) {
        setScreenshotUrl(screenshotUrl)
        setViewMode('screenshot')
        setIsScreenshotLoading(false)
        setHasError(false)
        
        // 캐시에 저장
        screenshotProxy.current.cacheScreenshot(targetUrl, screenshotUrl)
      } else {
        throw new Error('No screenshot URL returned')
      }
    } catch (error) {
      console.error('Screenshot capture failed:', error)
      setIsScreenshotLoading(false)
      setHasError(true)
      setErrorMessage(`Failed to capture screenshot: ${error.message}. Try iframe mode instead.`)
    }
  }

  const handleUrlSubmit = (e) => {
    e.preventDefault()
    navigateToUrl(currentUrl)
  }

  const navigateToUrl = (newUrl) => {
    setIsLoading(true)
    setHasError(false)
    setScreenshotUrl(null)
    
    // URL 형식 정규화
    let formattedUrl = newUrl
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl
    }
    
    // 차단된 사이트 확인
    if (checkIfSiteBlocked(formattedUrl) && viewMode === 'iframe') {
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
    
    // 스크린샷 모드면 자동으로 캡처
    if (viewMode === 'screenshot') {
      captureScreenshot(formattedUrl)
    }
    
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
    
    if (viewMode === 'screenshot') {
      captureScreenshot(currentUrl)
    } else if (iframeRef.current) {
      const refreshUrl = currentUrl + (currentUrl.includes('?') ? '&' : '?') + 'refresh=' + Date.now()
      iframeRef.current.src = refreshUrl
    }
    
    setTimeout(() => setIsLoading(false), 3000)
  }

  const openInNewTab = () => {
    window.open(currentUrl, '_blank')
  }

  const openInNewTabWithMessage = () => {
    const newTab = window.open(currentUrl, '_blank')
    if (newTab) {
      // 사용자에게 새 탭에서 상호작용 가능하다고 알림
      console.log('Opened in new tab for direct interaction')
    }
  }

  const handleInteractionRequest = () => {
    // 상호작용이 필요한 경우 자동으로 새 탭 열기 제안
    if (confirm('This action requires direct interaction with the website. Would you like to open it in a new tab?')) {
      openInNewTabWithMessage()
    }
  }

  const tryAlternative = () => {
    const alternativeUrl = getAlternativeUrl(currentUrl)
    if (alternativeUrl) {
      navigateToUrl(alternativeUrl)
    }
  }

  const switchViewMode = (mode) => {
    setViewMode(mode)
    setHasError(false)
    setScreenshotUrl(null)
    
    // 부모 컴포넌트에 viewMode 변경 알림
    if (onViewModeChange) {
      onViewModeChange(mode)
    }
    
    if (mode === 'screenshot') {
      captureScreenshot(currentUrl)
    } else {
      // iframe 모드로 다시 로드
      navigateToUrl(currentUrl)
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

  const handleScreenshotError = () => {
    setHasError(true)
    setErrorMessage('Failed to load screenshot. Try refreshing or switching to iframe mode.')
    setIsScreenshotLoading(false)
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
              disabled={isLoading || isScreenshotLoading}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${(isLoading || isScreenshotLoading) ? 'animate-spin' : ''}`} />
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

          {/* 뷰 모드 전환 버튼 */}
          <div className="flex items-center space-x-1 border-l pl-2">
            <button
              onClick={() => switchViewMode('iframe')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'iframe' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-200'
              }`}
              title="Iframe Mode"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => switchViewMode('screenshot')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'screenshot' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-200'
              }`}
              title="Screenshot Mode"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* 추가 버튼 */}
          <div className="flex items-center space-x-1 border-l pl-2">
            <button
              onClick={goHome}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              title="Go Home"
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              onClick={handleInteractionRequest}
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
        {(isLoading || isScreenshotLoading) && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-600">
                {viewMode === 'screenshot' ? 'Capturing screenshot...' : 'Loading...'}
              </span>
            </div>
          </div>
        )}
        
        {hasError ? (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center p-8 max-w-md">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {viewMode === 'screenshot' ? 'Screenshot Failed' : 'Access Blocked'}
              </h3>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <p className="text-sm text-gray-500 mb-6">
                {viewMode === 'iframe' 
                  ? 'Many websites block iframe access for security reasons. Try screenshot mode or use alternatives.'
                  : 'Screenshot capture failed. This might be due to CORS restrictions or API limitations.'
                }
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => switchViewMode(viewMode === 'iframe' ? 'screenshot' : 'iframe')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  {viewMode === 'iframe' ? <Camera className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                  <span>Try {viewMode === 'iframe' ? 'Screenshot' : 'Iframe'} Mode</span>
                </button>
                <button
                  onClick={handleInteractionRequest}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in New Tab</span>
                </button>
                {getAlternativeUrl(currentUrl) && (
                  <button
                    onClick={tryAlternative}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Try Alternative</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : viewMode === 'screenshot' && screenshotUrl ? (
          <div className="w-full h-full flex flex-col bg-gray-100">
            {/* 상호작용 안내 메시지 */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-sm text-yellow-800">
                    <strong>Screenshot Mode:</strong> You can view the website but cannot interact with it (type, click, etc.).
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    For form input or clicking, use the "Open in New Tab" button below.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={openInNewTabWithMessage}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors flex items-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open in New Tab</span>
                </button>
                <button
                  onClick={() => switchViewMode('iframe')}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <Monitor className="w-3 h-3" />
                  <span>Try Iframe Mode</span>
                </button>
              </div>
            </div>
            
            {/* 스크린샷 이미지 */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={screenshotUrl}
                alt="Website Screenshot"
                className="max-w-full max-h-full object-contain border border-gray-300 rounded-lg shadow-lg"
                onError={handleScreenshotError}
                onLoad={() => setIsScreenshotLoading(false)}
              />
            </div>
          </div>
        ) : viewMode === 'iframe' ? (
          <iframe
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-0"
            title="Browser Viewer"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content</h3>
              <p className="text-gray-600">Enter a URL to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowserViewer 