import React from 'react';

export default function Sidebar({ history, onNewChat, onSelectHistory }) {
  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      backgroundColor: 'var(--bg-sidebar)', // App.css에 정의된 변수
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      flexShrink: 0, // 사이드바 크기 고정
    }}>
      {/* ➕ 새 채팅 버튼 */}
      <button 
        onClick={onNewChat}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-main)',
          color: 'var(--text-main)',
          cursor: 'pointer',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}
      >
        + New Chat
      </button>
      
      {/* 📚 히스토리 영역 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-sub)', marginBottom: '10px', fontWeight: 'bold', opacity: 0.7 }}>
          RECENT SEARCHES
        </p>
        
        {history.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginTop: '10px' }}>기록이 없습니다.</p>
        ) : (
          history.map(item => (
            <div 
              key={item.id} 
              onClick={() => onSelectHistory(item)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '4px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'var(--border-color)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              🕒 {item.title}
            </div>
          ))
        )}
      </div>

      {/* 하단 로고/버전 */}
      <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-sub)' }}>
        박주호 Portfolio v1
      </div>
    </aside>
  );
}