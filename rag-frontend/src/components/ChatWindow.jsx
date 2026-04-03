import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatWindow({ chatLog, loading }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, loading]);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-40 relative">
      {chatLog.length === 0 ? (
        // 🌟 [수정] 모든 텍스트와 카드를 제거한 미니멀 디자인
        <div className="h-full flex flex-col items-center justify-center pt-20">
          <div className="max-w-4xl w-full text-center">
            {/* 아무것도 넣지 않거나, 
               Gemini처럼 아주 연한 로고 하나만 중앙에 띄우고 싶다면 
               여기에 아이콘 하나만 남기셔도 됩니다. 
            */}
          </div>
        </div>
      ) : (
        // --- 기존 채팅창 디자인 (질문이 시작되면 나타남) ---
        <div className="max-w-3xl mx-auto space-y-8 mt-10">
          {chatLog.map((chat, index) => (
            <ChatMessage key={index} {...chat} />
          ))}
          {loading && (
            <div className="flex justify-start items-center gap-3 text-gray-400 p-5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          )}
        </div>
      )}
      <div ref={scrollRef} />
    </main>
  );
}