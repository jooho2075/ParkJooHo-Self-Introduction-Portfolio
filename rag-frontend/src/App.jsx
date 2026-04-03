import { useState, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [chatLog, setChatLog] = useState([])
  const [loading, setLoading] = useState(false)
  
  // 🌓 다크모드 상태 관리 (초기값: 라이트 모드)
  const [darkMode, setDarkMode] = useState(false);

  // 테마가 변경될 때마다 <html> 태그에 속성 부여
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { role: 'user', content: input };
    setChatLog(prev => [...prev, userMessage]);
    setLoading(true);
    setChatLog(prev => [...prev, { role: 'ai', content: '' }]);
    const currentInput = input;
    setInput('');

    try {
      const response = await fetch('http://localhost:8080/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentInput }),
      });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedAnswer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        lines.forEach(line => {
          if (line.startsWith('data:')) {
            accumulatedAnswer += line.replace('data:', '').trim();
            setChatLog(prev => {
              const newLog = [...prev];
              newLog[newLog.length - 1] = { role: 'ai', content: accumulatedAnswer };
              return newLog;
            });
          }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative" 
         style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', transition: 'all 0.3s' }}>
      
      {/* 1. 최상단 중앙 고정 헤더 + 우측 테마 버튼 */}
      <header style={{
        width: '100%',
        padding: '16px 0',
        backgroundColor: 'var(--bg-header)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ maxWidth: '1024px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
          {/* 왼쪽 여백 (중앙 정렬 균형용) */}
          <div style={{ width: '40px' }}></div>

          {/* 중앙 타이틀 */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              박주호의 <span style={{ color: '#1a73e8' }}>Portfolio</span>입니다
            </h1>
          </div>

          {/* 🌓 우측 다크모드 토글 버튼 */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--chat-ai-bg)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.2s'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* 2. 중앙 대화창 영역 */}
      <main style={{ flex: 1, overflowY: 'auto', paddingTop: '100px', paddingBottom: '140px' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', width: '100%' }}>
          <ChatWindow chatLog={chatLog} loading={loading} />
        </div>
      </main>

      {/* 3. 하단 입력창 */}
      <ChatInput input={input} setInput={setInput} onSend={handleSendMessage} loading={loading} />
    </div>
  )
}

export default App