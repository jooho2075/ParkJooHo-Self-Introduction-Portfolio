import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header' // 🌟 불러오기
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [chatLog, setChatLog] = useState([])
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // handleSendMessage 로직 (기존과 동일)
  const handleSendMessage = async () => { /* ... */ };

  return (
    <div style={{ 
      display: 'flex', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden', 
      backgroundColor: 'var(--bg-main)', 
      color: 'var(--text-main)',
      transition: 'background-color 0.3s'
    }}>
      
      <Sidebar 
        history={history} 
        onNewChat={() => setChatLog([])} 
        onSelectHistory={(item) => console.log(item.title)} 
      />

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        
        {/* 🌟 분리한 헤더 컴포넌트 사용 */}
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <main style={{ flex: 1, overflowY: 'auto', paddingTop: '20px', paddingBottom: '120px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '0 20px' }}>
            <ChatWindow chatLog={chatLog} loading={loading} />
          </div>
        </main>

        <ChatInput 
          input={input} 
          setInput={setInput} 
          onSend={handleSendMessage} 
          loading={loading} 
        />
      </div>
    </div>
  )
}

export default App