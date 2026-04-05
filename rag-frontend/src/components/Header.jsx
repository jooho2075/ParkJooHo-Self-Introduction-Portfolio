import React from 'react';

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header style={{
      width: '100%',
      padding: '16px 0',
      backgroundColor: 'var(--bg-header)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 50,
      flexShrink: 0 // 헤더 높이 고정
    }}>
      <div style={{ 
        maxWidth: '1024px', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 24px' 
      }}>
        {/* 좌측 여백 (중앙 정렬 균형용) */}
        <div style={{ width: '40px' }}></div>

        {/* 중앙 타이틀 */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
            박주호의 <span style={{ color: '#1a73e8' }}>Portfolio</span>입니다
          </h1>
        </div>

        {/* 🌓 우측 다크모드 토글 버튼 */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "라이트 모드" : "다크 모드"}
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
  );
}