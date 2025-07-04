import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { sendToOpenAI } from '../utils/openai'
import { executeBrowserCommand } from '../utils/browserController'

const Chat = ({ apiKey, onBrowserCommand, currentUrl, onUrlChange }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '안녕하세요! 브라우저를 제어할 수 있는 AI 어시스턴트입니다. 어떤 도움이 필요하신가요?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // OpenAI API로 메시지 전송
      const response = await sendToOpenAI(inputValue, apiKey, currentUrl)
      
      // AI 응답 추가
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.message,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])

      // 브라우저 명령이 있으면 실행
      if (response.command) {
        console.log('Executing command:', response.command)
        const result = await executeBrowserCommand(response.command, onUrlChange, currentUrl)
        console.log('Command result:', result)
        onBrowserCommand(response.command)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: '죄송합니다. 오류가 발생했습니다. API 키를 확인해주세요.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 채팅 헤더 */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">AI 어시스턴트</h2>
        <p className="text-sm text-gray-600">브라우저를 제어해보세요</p>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} fade-in`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'bot' && (
                  <Bot className="w-4 h-4 mt-0.5 text-gray-600" />
                )}
                {message.type === 'user' && (
                  <User className="w-4 h-4 mt-0.5 text-white" />
                )}
                <div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start fade-in">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-gray-600" />
                <div className="flex items-center space-x-1">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                  <span className="text-sm text-gray-600">생각 중...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="브라우저 명령을 입력하세요... (예: 구글에서 검색해줘)"
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat 