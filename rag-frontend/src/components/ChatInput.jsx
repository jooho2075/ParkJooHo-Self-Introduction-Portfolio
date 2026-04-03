import React from 'react';

export default function ChatInput({ input, setInput, onSend, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <footer style={{
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: '24px',
      background: 'linear-gradient(to top, white, rgba(255,255,255,0.9), transparent)',
      zIndex: 1000
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1024px', // 여기서 너비를 결정합니다! (M5 맥북에 딱 좋은 사이즈)
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '8px 24px',
          border: '2px solid #e5e7eb', // 선명한 테두리
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s'
        }}>
          <textarea 
            rows="2"
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              color: '#374151',
              padding: '12px 0',
              resize: 'none',
              height: '56px',
              lineHeight: '1.6'
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="박주호 개발자에 대해 궁금한 것을 질문하세요..."
            disabled={loading}
          />
          
          <button 
            onClick={onSend}
            disabled={loading || !input.trim()}
            style={{
              marginLeft: '16px',
              padding: '12px',
              backgroundColor: input.trim() ? '#1a73e8' : '#f3f4f6',
              color: 'white',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? (
              <div style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '12px', fontWeight: '500' }}>
          박주호 포트폴리오 데이터를 기반으로 한 전용 AI 에이전트입니다.
        </p>
      </div>
    </footer>
  );
}