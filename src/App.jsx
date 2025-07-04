import React, { useState, useEffect } from 'react'
import Chat from './components/Chat'
import BrowserViewer from './components/BrowserViewer'
import ApiKeyModal from './components/ApiKeyModal'
import { Settings, Monitor, MessageCircle } from 'lucide-react'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com')
  const [showApiModal, setShowApiModal] = useState(false)
  const [chatVisible, setChatVisible] = useState(true)

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    } else {
      setShowApiModal(true)
    }
  }, [])

  const handleApiKeySet = (key) => {
    setApiKey(key)
    localStorage.setItem('openai_api_key', key)
    setShowApiModal(false)
  }

  const handleBrowserCommand = (command) => {
    // 브라우저 명령 처리 로직은 Chat 컴포넌트에서 전달받음
    console.log('Browser command received in App:', command)
    
    // 뒤로가기 명령 처리
    if (command.action === 'back') {
      // BrowserViewer의 뒤로가기 기능 실행
      console.log('Handling back command')
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Monitor className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Browser Chat</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">AI Browser Control</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">v1.1.0</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setChatVisible(!chatVisible)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Toggle Chat"
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowApiModal(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 브라우저 뷰어 */}
        <div className={`${chatVisible ? 'flex-1' : 'w-full'} bg-white`}>
          <BrowserViewer 
            url={currentUrl} 
            onUrlChange={setCurrentUrl}
          />
        </div>

        {/* 채팅 패널 */}
        {chatVisible && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <Chat 
              apiKey={apiKey}
              onBrowserCommand={handleBrowserCommand}
              currentUrl={currentUrl}
              onUrlChange={setCurrentUrl}
            />
          </div>
        )}
      </div>

      {/* API 키 설정 모달 */}
      {showApiModal && (
        <ApiKeyModal 
          onApiKeySet={handleApiKeySet}
          onClose={() => setShowApiModal(false)}
          existingKey={apiKey}
        />
      )}
    </div>
  )
}

export default App 