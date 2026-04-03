import { useState, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [chatLog, setChatLog] = useState([])
  const [loading, setLoading] = useState(false)
  
  // 🌓 다크모드 상태 관리
  const [darkMode, setDarkMode] = useState(false);
  
  // 🌐 언어 선택 상태 관리 (기본값: 한국어)
  const [language, setLanguage] = useState('ko');

  // 테마가 변경될 때마다 <html> 태그에 속성 부여
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setChatLog(prev => [...prev, userMessage]);
    setLoading(true);
    
    // AI의 답변이 들어올 공간 확보
    setChatLog(prev => [...prev, { role: 'ai', content: '' }]);
    
    const currentInput = input;
    setInput('');

    try {
      // 🌟 백엔드로 'question'과 'lang' 정보를 함께 전송
      const response = await fetch('http://localhost:8080/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: currentInput,
          lang: language // 'ko', 'en', 'ja', 'zh' 중 하나
        }),
      });

      if (!response.body) throw new Error("ReadableStream not supported");

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
            // SSE 데이터 파싱 및 누적
            accumulatedAnswer += line.replace('data:', '').trim();
            
            // 실시간으로 마지막 메시지(AI 답변) 업데이트
            setChatLog(prev => {
              const newLog = [...prev];
              newLog[newLog.length - 1] = { role: 'ai', content: accumulatedAnswer };
              return newLog;
            });
          }
        });
      }
    } catch (error) {
      console.error("Streaming Error:", error);
      setChatLog(prev => {
        const newLog = [...prev];
        newLog[newLog.length - 1] = { 
          role: 'ai', 
          content: "❌ 연결 오류가 발생했습니다. 백엔드 서버 상태를 확인해주세요!" 
        };
        return newLog;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative" 
         style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', transition: 'all 0.3s' }}>
      
      {/* 1. 최상단 고정 헤더: 언어선택(좌) + 타이틀(중) + 다크모드(우) */}
      <header style={{
        width: '100%',
        padding: '12px 0',
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
          
          {/* 🌐 좌측: 언어 선택 드롭다운 (KR, EN, JP, CN) */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                backgroundColor: 'var(--chat-ai-bg)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <option value="ko">🇰🇷 KR</option>
              <option value="en">🇺🇸 EN</option>
              <option value="ja">🇯🇵 JP</option>
              <option value="zh">🇨🇳 CN</option>
            </select>
          </div>

          {/* 중앙: 고정 타이틀 */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px', margin: 0 }}>
              박주호의 <span style={{ color: '#1a73e8' }}>Portfolio</span>입니다
            </h1>
          </div>

          {/* 🌓 우측: 다크모드 토글 버튼 */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "라이트 모드" : "다크 모드"}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--chat-ai-bg)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'all 0.2s',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
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

      {/* 3. 하단 입력창 (디자인이 적용된 외부 컴포넌트) */}
      <ChatInput 
        input={input} 
        setInput={setInput} 
        onSend={handleSendMessage} 
        loading={loading} 
      />
    </div>
  )
}

export default App