// 스크린샷 프록시 서비스 - CORS 문제 해결을 위한 유틸리티

export class ScreenshotProxy {
  constructor() {
    this.services = [
      {
        name: 'PagePeeker',
        url: (targetUrl) => `https://free.pagepeeker.com/v2/thumbs.php?size=l&url=${encodeURIComponent(targetUrl)}`,
        needsAuth: false,
        corsEnabled: true
      },
      {
        name: 'ScreenshotLayer',
        url: (targetUrl) => `https://api.screenshotlayer.com/api/capture?access_key=YOUR_API_KEY&url=${encodeURIComponent(targetUrl)}&viewport=1366x768&width=800`,
        needsAuth: true,
        corsEnabled: false
      },
      {
        name: 'HTMLCSStoImage',
        url: (targetUrl) => `https://hcti.io/v1/image?url=${encodeURIComponent(targetUrl)}`,
        needsAuth: true,
        corsEnabled: false
      }
    ]
  }

  /**
   * 주어진 URL의 스크린샷을 캡처합니다.
   * @param {string} targetUrl - 캡처할 웹페이지 URL
   * @param {Object} options - 캡처 옵션
   * @returns {Promise<string>} 스크린샷 이미지 URL
   */
  async captureScreenshot(targetUrl, options = {}) {
    const { service = 'PagePeeker', fallback = true } = options
    
    try {
      // 기본 서비스 시도
      const screenshotUrl = await this.tryService(service, targetUrl)
      if (screenshotUrl) {
        return screenshotUrl
      }
      
      // 폴백 서비스들 시도
      if (fallback) {
        return await this.tryFallbackServices(targetUrl)
      }
      
      throw new Error('No available screenshot services')
    } catch (error) {
      console.error('Screenshot capture failed:', error)
      throw error
    }
  }

  /**
   * 특정 서비스로 스크린샷 캡처를 시도합니다.
   * @param {string} serviceName - 사용할 서비스 이름
   * @param {string} targetUrl - 캡처할 URL
   * @returns {Promise<string|null>} 성공 시 이미지 URL, 실패 시 null
   */
  async tryService(serviceName, targetUrl) {
    const service = this.services.find(s => s.name === serviceName)
    if (!service) {
      throw new Error(`Unknown service: ${serviceName}`)
    }

    try {
      const screenshotUrl = service.url(targetUrl)
      
      // CORS가 활성화된 서비스는 직접 호출
      if (service.corsEnabled) {
        return screenshotUrl
      }
      
      // CORS가 비활성화된 서비스는 프록시 필요
      return await this.useProxy(screenshotUrl)
    } catch (error) {
      console.error(`Service ${serviceName} failed:`, error)
      return null
    }
  }

  /**
   * 폴백 서비스들을 순차적으로 시도합니다.
   * @param {string} targetUrl - 캡처할 URL
   * @returns {Promise<string>} 성공한 서비스의 이미지 URL
   */
  async tryFallbackServices(targetUrl) {
    const availableServices = this.services.filter(s => s.corsEnabled)
    
    for (const service of availableServices) {
      try {
        const result = await this.tryService(service.name, targetUrl)
        if (result) {
          return result
        }
      } catch (error) {
        console.error(`Fallback service ${service.name} failed:`, error)
        continue
      }
    }
    
    throw new Error('All fallback services failed')
  }

  /**
   * CORS 프록시를 사용하여 요청을 처리합니다.
   * @param {string} url - 프록시할 URL
   * @returns {Promise<string>} 프록시된 URL
   */
  async useProxy(url) {
    // 공개 CORS 프록시 서비스들
    const proxies = [
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/get?url=',
      'https://thingproxy.freeboard.io/fetch/'
    ]
    
    for (const proxy of proxies) {
      try {
        const proxyUrl = proxy + encodeURIComponent(url)
        
        // 프록시 서비스 테스트
        const response = await fetch(proxyUrl, {
          method: 'HEAD',
          mode: 'cors'
        })
        
        if (response.ok) {
          return proxyUrl
        }
      } catch (error) {
        console.error(`Proxy ${proxy} failed:`, error)
        continue
      }
    }
    
    throw new Error('All proxy services failed')
  }

  /**
   * 캐시된 스크린샷이 있는지 확인합니다.
   * @param {string} url - 확인할 URL
   * @returns {string|null} 캐시된 이미지 URL 또는 null
   */
  getCachedScreenshot(url) {
    const cacheKey = `screenshot_${btoa(url)}`
    const cached = localStorage.getItem(cacheKey)
    
    if (cached) {
      const { timestamp, imageUrl } = JSON.parse(cached)
      const now = Date.now()
      const oneHour = 60 * 60 * 1000
      
      // 1시간 이내의 캐시만 유효
      if (now - timestamp < oneHour) {
        return imageUrl
      } else {
        localStorage.removeItem(cacheKey)
      }
    }
    
    return null
  }

  /**
   * 스크린샷을 캐시에 저장합니다.
   * @param {string} url - 원본 URL
   * @param {string} imageUrl - 스크린샷 이미지 URL
   */
  cacheScreenshot(url, imageUrl) {
    const cacheKey = `screenshot_${btoa(url)}`
    const cacheData = {
      timestamp: Date.now(),
      imageUrl: imageUrl
    }
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Failed to cache screenshot:', error)
    }
  }

  /**
   * 캐시를 정리합니다.
   */
  clearCache() {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('screenshot_')) {
        localStorage.removeItem(key)
      }
    })
  }
}

export default new ScreenshotProxy() 