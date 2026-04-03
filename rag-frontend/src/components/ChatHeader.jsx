export default function ChatHeader() {
  return (
    <header className="w-full p-5 bg-white/90 backdrop-blur-md border-b sticky top-0 z-20 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-black text-gray-800">
          JOOHO <span className="text-blue-600">AI</span>
        </h1>
      </div>
      <div className="flex gap-4 items-center">
         <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100">
           박주호 포트폴리오입니다
         </span>
      </div>
    </header>
  );
}