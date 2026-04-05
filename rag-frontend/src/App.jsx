import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
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

  // 🕒 1. 히스토리 선택 시 해당 대화 기록을 불러오는 함수
  const handleSelectHistory = (item) => {
    if (loading) return; // 답변 중에는 전환 방지
    if (item.messages) {
      setChatLog(item.messages); // 저장된 메시지 배열을 채팅창에 주입
    }
  };

  // ➕ 2. 새 채팅 시작 함수
  const handleNewChat = () => {
    setChatLog([]);
    setInput('');
  };

  // 🚀 3. 메시지 전송 및 답변 저장 로직
  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input;
    const userMessage = { role: 'user', content: currentInput };

    // 화면에 사용자 메시지 먼저 표시
    setChatLog(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    // AI 답변을 위한 빈 공간 확보
    setChatLog(prev => [...prev, { role: 'ai', content: '' }]);

    try {
      const response = await fetch('http://localhost:8080/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentInput }),
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
            accumulatedAnswer += line.replace('data:', '').trim();

            // 실시간으로 화면 업데이트
            setChatLog(prev => {
              const newLog = [...prev];
              newLog[newLog.length - 1] = { role: 'ai', content: accumulatedAnswer };
              return newLog;
            });
          }
        });
      }

      // 🌟 [핵심] 답변이 완전히 완료된 후, 전체 대화 내용을 history에 저장/업데이트
      const finalAiMessage = { role: 'ai', content: accumulatedAnswer };
      
      setHistory(prev => {
        // 만약 새로운 채팅의 첫 질문이었다면 히스토리에 새 항목 추가
        if (chatLog.length === 0) {
          return [{
            id: Date.now(),
            title: currentInput,
            messages: [userMessage, finalAiMessage]
          }, ...prev];
        } else {
          // 기존 대화에 이어서 하는 중이라면 첫 번째 히스토리 아이템의 메시지만 업데이트
          const newHistory = [...prev];
          if (newHistory.length > 0) {
            newHistory[0] = {
              ...newHistory[0],
              messages: [...newHistory[0].messages, userMessage, finalAiMessage]
            };
          }
          return newHistory;
        }
      });

    } catch (error) {
      console.error("Streaming Error:", error);
      setChatLog(prev => {
        const newLog = [...prev];
        newLog[newLog.length - 1] = {
          role: 'ai',
          content: "❌ 서버 연결 실패. 서버 상태를 확인해 주세요!"
        };
        return newLog;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-main)',
      transition: 'background-color 0.3s'
    }}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        paddingTop: '12px'
      }}>
        <Sidebar
          history={history}
          onNewChat={handleNewChat}
          onSelectHistory={handleSelectHistory}
        />

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <main style={{
            flex: 1,
            overflowY: 'auto',
            paddingTop: '10px',
            marginBottom: '100px'
          }}>
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
    </div>
  )
}

export default App