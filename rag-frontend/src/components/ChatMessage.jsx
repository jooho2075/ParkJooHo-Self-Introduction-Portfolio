import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';

  return (
    // 1. 전체 컨테이너: 유저는 오른쪽(flex-end), AI는 왼쪽(flex-start)
    <div style={{
      display: 'flex',
      width: '100%',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '24px',
      padding: '0 16px'
    }}>
      
      {/* 2. 말풍선 박스 */}
      <div style={{
        maxWidth: '75%', // 너무 길어지지 않게 제한
        padding: '16px 20px',
        borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px', // 말풍선 꼬리 느낌
        backgroundColor: isUser ? '#1a73e8' : '#ffffff', // 내 질문은 파랑, AI는 흰색
        color: isUser ? '#ffffff' : '#374151',
        border: isUser ? 'none' : '2px solid #e5e7eb', // AI 답변에는 명확한 선 추가
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        lineHeight: '1.6',
        fontSize: '15px'
      }}>
        
        {/* 3. 역할 이름 표시 */}
        <div style={{
          fontSize: '10px',
          fontWeight: '900',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '8px',
          opacity: 0.8,
          color: isUser ? '#e0e7ff' : '#9ca3af'
        }}>
          {isUser ? 'My Question' : 'JOOHO AI ASSISTANT'}
        </div>
        
        {/* 4. 마크다운 내용 (prose 스타일 적용) */}
        <div className="prose prose-sm max-w-none" style={{ color: 'inherit' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}