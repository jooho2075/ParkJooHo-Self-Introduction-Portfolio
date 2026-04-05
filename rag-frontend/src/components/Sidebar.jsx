import React from 'react';

export default function Sidebar({ history, onNewChat, onSelectHistory }) {
  return (
    <aside style={{
      width: '260px',
      height: '100%', 
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      flexShrink: 0, 
      boxSizing: 'border-box'
    }}>
      {/* ➕ 새 채팅 버튼 */}
      <div style={{ flexShrink: 0 }}>
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
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          + New Chat
        </button>
      </div>
      
      {/* 📚 히스토리 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="custom-scrollbar">
        <p style={{ 
          fontSize: '11px', 
          color: 'var(--text-sub)', 
          marginBottom: '10px', 
          fontWeight: 'bold', 
          opacity: 0.7,
          letterSpacing: '0.5px'
        }}>
          RECENT SEARCHES
        </p>
        
        {history.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginTop: '10px' }}>기록이 없습니다.</p>
        ) : (
          history.map(item => (
            <div 
              key={item.id} 
              onClick={() => onSelectHistory(item)} // 🌟 클릭 시 item 전체 데이터 전달
              style={{
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '6px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'all 0.2s',
                border: '1px solid transparent'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'var(--border-color)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <span style={{ marginRight: '8px' }}>🕒</span> 
              {item.title}
            </div>
          ))
        )}
      </div>

      {/* 하단 버전 정보 */}
      <div style={{ 
        paddingTop: '20px', 
        borderTop: '1px solid var(--border-color)', 
        fontSize: '11px', 
        color: 'var(--text-sub)',
        flexShrink: 0,
        textAlign: 'center'
      }}>
        박주호 Portfolio AI v1.0
      </div>
    </aside>
  );
}