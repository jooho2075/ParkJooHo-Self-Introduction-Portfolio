import { useState } from 'react'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [chatLog, setChatLog] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    // 1. 사용자 메시지 추가 및 입력창 초기화
    const userMessage = { role: 'user', content: input };
    setChatLog(prev => [...prev, userMessage]);
    setLoading(true);
    
    // 2. AI의 답변이 들어올 빈 공간을 미리 생성
    setChatLog(prev => [...prev, { role: 'ai', content: '' }]);
    
    const currentInput = input;
    setInput('');

    try {
      // 🌟 [수정] axios 대신 fetch를 사용하여 스트리밍 엔드포인트 호출
      const response = await fetch('http://localhost:8080/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentInput }),
      });

      if (!response.body) throw new Error("ReadableStream not supported");

      // 3. 스트림을 읽기 위한 리더(Reader)와 디코더 설정
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedAnswer = "";

      // 4. 데이터 조각(Chunk)을 실시간으로 읽어서 업데이트
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        // SSE 데이터 파싱 (Spring의 Flux는 'data:' 접두어를 붙여 보냅니다)
        const lines = chunk.split('\n');
        lines.forEach(line => {
          if (line.startsWith('data:')) {
            const content = line.replace('data:', '').trim();
            accumulatedAnswer += content;

            // 5. 실시간으로 마지막 메시지(AI 답변)의 내용만 업데이트
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
          content: "❌ 서버와 연결할 수 없습니다. 백엔드 상태를 확인해주세요!" 
        };
        return newLog;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="h-screen bg-white flex flex-col text-gray-900 overflow-hidden relative">
    
    {/* 1. 최상단 중앙 고정 헤더 */}
    <header style={{
      width: '100%',
      padding: '24px 0',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #f3f4f6',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50,
      display: 'flex',
      justifyContent: 'center', // 가로 중앙 정렬
      alignItems: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '22px',
          fontWeight: '800',
          color: '#1f2937',
          letterSpacing: '-0.5px'
        }}>
          박주호의 <span style={{ color: '#1a73e8' }}>Portfolio</span>입니다
        </h1>
        <div style={{
          fontSize: '11px',
          color: '#9ca3af',
          fontWeight: '600',
          marginTop: '4px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          v1 (Streaming AI)
        </div>
      </div>
    </header>

    {/* 2. 중앙 대화창 영역 (헤더만큼 상단 여백을 줘야 가려지지 않습니다) */}
    <main style={{
      flex: 1,
      overflowY: 'auto',
      paddingTop: '100px', // 헤더 높이만큼 띄워줌
      paddingBottom: '140px', // 입력창 높이만큼 띄워줌
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ maxWidth: '1024px', width: '100%', padding: '0 20px' }}>
        <ChatWindow chatLog={chatLog} loading={loading} />
      </div>
    </main>

    {/* 3. 하단 입력창 (이미 위치 잘 잡으신 ChatInput) */}
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