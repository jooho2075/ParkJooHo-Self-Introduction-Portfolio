package dev.rag.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
@RequiredArgsConstructor
public class RagService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    /**
     * 질문을 받아 VectorStore에서 관련 데이터를 검색한 후 스트리밍 답변을 반환합니다.
     */
    public Flux<String> askQuestionStream(String message) {

        // 검색 설정: 유사도 0.7 이상, 상위 6개 문서 참고
        SearchRequest searchRequest = SearchRequest.builder()
                .topK(6)
                .similarityThreshold(0.7)
                .build();

        // 🌟 시스템 프롬프트를 통해 박주호 개발자 비서라는 정체성을 부여합니다.
        return chatClient.prompt()
                .system("너는 박주호 개발자의 전용 포트폴리오 안내 비서야. " +
                        "제공된 박주호의 이력 데이터를 기반으로 질문에 친절하고 상세하게 답변해줘.")
                .advisors(QuestionAnswerAdvisor.builder(vectorStore)
                        .searchRequest(searchRequest)
                        .build())
                .user(message)
                .stream()
                .content();
    }
}