import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [chatLog, setChatLog] = useState([])
  const [loading, setLoading] = useState(false)
  
  // 🌓 다크모드 상태 관리
  const [darkMode, setDarkMode] = useState(false);
  
  // 📚 검색 기록 상태 관리
  const [history, setHistory] = useState([]);

  // 테마가 변경될 때마다 <html> 태그에 속성 부여
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    // 🌟 첫 질문일 때만 히스토리에 추가 (간단한 로직)
    if (chatLog.length === 0) {
      setHistory(prev => [{ id: Date.now(), title: input }, ...prev]);
    }

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
    } catch (error) { console.error("Streaming Error:", error); } finally { setLoading(false); }
  };

  return (
    // 🌟 핵심 해결 포인트: className 대신 style 속성을 사용해 레이아웃 강제 고정
    <div style={{ 
      display: 'flex', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden', 
      backgroundColor: 'var(--bg-main)', 
      color: 'var(--text-main)',
      transition: 'background-color 0.3s'
    }}>
      
      {/* ⬅️ 좌측 사이드바 (사이드바 내부 스타일도 인라인 스타일로 되어있는지 확인이 필요합니다) */}
      <Sidebar 
        history={history} 
        onNewChat={() => setChatLog([])} 
        onSelectHistory={(item) => console.log(item.title)} 
      />

      {/* ➡️ 우측 메인 영역 */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        
        {/* 1. 최상단 고정 헤더 */}
        <header style={{
          width: '100%',
          padding: '16px 0',
          backgroundColor: 'var(--bg-header)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 50
        }}>
          <div style={{ maxWidth: '1024px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
            {/* 좌측 여백 */}
            <div style={{ width: '40px' }}></div>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '800' }}>
                박주호의 <span style={{ color: '#1a73e8' }}>Portfolio</span>입니다
              </h1>
            </div>
            {/* 🌓 다크모드 버튼 */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              style={{
                width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--border-color)',
                backgroundColor: 'var(--chat-ai-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* 2. 대화창 영역 */}
        <main style={{ flex: 1, overflowY: 'auto', paddingTop: '20px', paddingBottom: '120px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '0 20px' }}>
            <ChatWindow chatLog={chatLog} loading={loading} />
          </div>
        </main>

        {/* 3. 하단 입력창 (이미 디자인이 잡혀 있으므로 Props만 전달) */}
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