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
      
      {/* 2. 말풍선 박스: CSS 변수 적용 */}
      <div style={{
        maxWidth: '75%', 
        padding: '16px 20px',
        // 유저와 AI의 말풍선 꼬리 방향 차별화
        borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px', 
        // 유저는 고정 파랑, AI는 테마 변수 배경색 적용
        backgroundColor: isUser ? '#1a73e8' : 'var(--chat-ai-bg)', 
        // 글자색도 테마 변수 적용 (유저는 화이트 고정)
        color: isUser ? '#ffffff' : 'var(--text-main)',
        // AI 답변에만 테마 변수 테두리 적용
        border: isUser ? 'none' : '2px solid var(--chat-ai-border)', 
        boxShadow: isUser ? '0 4px 15px rgba(26, 115, 232, 0.2)' : '0 4px 15px rgba(0,0,0,0.05)',
        lineHeight: '1.6',
        fontSize: '15px',
        transition: 'all 0.3s ease' // 테마 전환 시 부드럽게 변경
      }}>
        
        {/* 3. 역할 이름 표시 */}
        <div style={{
          fontSize: '10px',
          fontWeight: '900',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '8px',
          opacity: 0.8,
          // 텍스트 색상도 유저/AI와 테마에 맞춰 최적화
          color: isUser ? '#e0e7ff' : 'var(--text-sub)'
        }}>
          {isUser ? 'My Question' : 'JOOHO AI ASSISTANT'}
        </div>
        
        {/* 4. 마크다운 내용 (prose 스타일 적용) */}
        {/* style={{ color: 'inherit' }}를 주어야 부모의 다크모드 글자색을 그대로 따라갑니다. */}
        <div className="prose prose-sm max-w-none" style={{ color: 'inherit' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}