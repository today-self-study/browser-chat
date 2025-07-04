# Browser Chat 🌐💬

> AI-powered browser control through natural language chat interface

A simple and intuitive web application that allows you to control your browser through natural language commands via a chat interface.

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](https://github.com/your-username/browser-chat)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-orange.svg)](https://openai.com/)

## ✨ Features

- 🤖 **AI Browser Control**: Natural language command processing with OpenAI GPT
- 🌐 **Real-time Browser Viewer**: iframe-based web page display
- 💬 **Intuitive Chat UI**: Friendly conversational interface
- 🔒 **Secure API Key Management**: Local storage-based secure storage
- 📱 **Responsive Design**: Perfect user experience on all devices
- 🌍 **Multi-language Support**: AI responds in user's preferred language
- 🛡️ **Smart Site Blocking**: Automatic detection and handling of iframe-blocked sites
- 🔄 **Alternative Site Suggestions**: Automatic alternatives for blocked websites
- 📸 **Hybrid Viewing Modes**: Both iframe and screenshot-based rendering
- 🎯 **Advanced Screenshot Capture**: Full-page screenshots with caching system
- ⚡ **Enhanced Error Handling**: User-friendly error messages with actionable solutions

## 🚀 Demo

[Try it live on GitHub Pages](https://your-username.github.io/browser-chat)

## 📋 Usage Examples

```
User: "Go to Google"
AI: "Going to Google!" → https://www.google.com

User: "Search for Python"
AI: "Searching for Python!" → Google search results

User: "Open YouTube"
AI: "Going to YouTube!" → https://www.youtube.com

User: "Refresh page"
AI: "Refreshing the page!" → Current page refresh
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Component-based UI library
- **Vite** - Fast development environment and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### AI & API
- **OpenAI GPT-3.5-turbo** - Natural language processing and command interpretation
- **OpenAI JavaScript SDK** - Client-side API communication

### Deployment
- **GitHub Pages** - Static site hosting
- **GitHub Actions** - Automated deployment pipeline

## 🔧 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/browser-chat.git
cd browser-chat
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build & Deploy
```bash
npm run build
npm run deploy
```

## 🔑 OpenAI API Key Setup

1. Create account at [OpenAI Platform](https://platform.openai.com/)
2. Generate API key (paid account required)
3. Click settings button in the application
4. Enter your API key

> ⚠️ **Security Notice**: API key is stored only in browser local storage and is not transmitted externally.

## 📁 Project Structure

```
browser-chat/
├── public/
│   ├── favicon.svg          # Site icon
│   └── index.html           # Main HTML
├── src/
│   ├── components/
│   │   ├── Chat.jsx         # Chat interface
│   │   ├── BrowserViewer.jsx # Browser viewer
│   │   └── ApiKeyModal.jsx  # API key setup modal
│   ├── utils/
│   │   ├── openai.js        # OpenAI API communication
│   │   └── browserController.js # Browser control logic
│   ├── App.jsx              # Main application
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Supported Commands

### Navigation
- `"Go to Google"`, `"Open YouTube"`, `"Navigate to GitHub"`
- `"Visit Wikipedia"`, `"Go to Stack Overflow"`

### Search
- `"Search for Python"`, `"Find React tutorials"`
- `"Look up weather"`, `"Search news"`

### Browser Control
- `"Refresh page"`, `"Reload current page"`
- `"Go back"`, `"Navigate to previous page"`

### Multi-language Support
- English: `"Go to Google"`, `"Search for JavaScript"`
- Korean: `"구글로 가줘"`, `"파이썬 검색해줘"`
- Japanese: `"Googleに行って"`, `"Pythonを検索して"`

## 🌟 Key Features

### 1. Natural Language Processing
- Accurate command interpretation using GPT-3.5-turbo
- Perfect support for multiple languages
- Context-based smart responses

### 2. Real-time Browser Control
- Safe iframe-based web page display
- Real-time URL change and navigation
- Browser history management

### 3. User-friendly UI
- Intuitive chat interface
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions

### 4. Security & Privacy
- Client-side API key management
- Local storage-based secure storage
- Complete frontend implementation without external servers

## 🔄 Changelog

### v1.3.0 (2024-01-XX)
- **🎯 Hybrid Browser Technology**: Added screenshot-based rendering for blocked sites
- **📸 Advanced Screenshot Capture**: Full-page screenshots with caching system
- **🔄 Dual Viewing Modes**: Switch between iframe and screenshot modes
- **🌐 CORS-Free Screenshot API**: Integrated multiple screenshot services
- **⚡ Seamless Mode Switching**: AI can automatically choose best viewing mode
- **🛡️ Enhanced Security Bypass**: Screenshot mode bypasses all iframe restrictions
- **🎨 Improved UI Controls**: New screenshot/iframe toggle buttons

### v1.2.0 (2024-01-XX)
- **🛡️ Enhanced Security Handling**: Smart detection and handling of iframe-blocked sites
- **🔄 Alternative Site Suggestions**: Automatic alternatives for blocked websites (Google→Bing, YouTube→Invidious)
- **📊 Improved Error UI**: User-friendly error messages with actionable solutions
- **🌐 Updated Default Search**: Changed from Google to Bing for better iframe compatibility
- **⚡ Better User Experience**: Clear explanations when sites can't be loaded
- **🎯 Smart Site Detection**: Pre-emptive blocking of known problematic sites

### v1.1.0 (2024-01-XX)
- **Complete OpenAI API Integration**: All command processing handled by AI
- **JSON Response Enforcement**: More stable command parsing (response_format setting)
- **Improved Response Consistency**: temperature 0.3 for more accurate command interpretation
- **Enhanced Prompt Engineering**: More detailed system prompts for improved command recognition
- **Major Website Mapping**: Auto-mapping for Naver, Daum, GitHub, Wikipedia, etc.
- **Removed Text Command Extraction**: Simplified to let AI handle all commands
- **Project Structure Cleanup**: Added .gitignore for unnecessary file exclusion

### v1.0.0 (2024-01-XX)
- Initial release
- AI chat-based browser control functionality
- GitHub Pages deployment support
- OpenAI API integration

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Developer: [Your Name]
- Email: [your-email@example.com]
- Project Link: [https://github.com/your-username/browser-chat](https://github.com/your-username/browser-chat)

---

⭐ If this project helped you, please give it a star!