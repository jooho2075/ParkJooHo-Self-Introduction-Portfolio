package dev.rag.service;

import dev.rag.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

// 사용자의 질문을 분석해 ChromaDB에서 가장 유사한 경험을 찾음(Retrieval)
// 찾은 정보를 OpenAI 프롬프트에 합쳐서 답변 생성(Generation)
@Service
@RequiredArgsConstructor
public class RagService {
    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    /*
    * 사용자의 질문을 받고 ChromaDB에서 관련 정보를 찾고 AI답변 생성
    * */
    public ChatResponse askQuestion(String message) {
        // 1. ChatClient를 통해 대화 시작
        String answer = chatClient.prompt()
                // 2. QuestionAnswerAdvisor : Rag핵심 모듈
                // -> 질문 벡터화 -> DB검색 -> 컨텍스트 추출 -> 프롬프트 합성
                .advisors(QuestionAnswerAdvisor.builder(vectorStore)
                        .searchRequest(SearchRequest.builder().build())
                        .build())
                .user(message)
                .call()
                .content();
        return ChatResponse.builder()
                .answer(answer)
                .build();
    }
}
