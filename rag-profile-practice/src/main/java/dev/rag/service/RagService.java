package dev.rag.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux; // 중요!

@Service
@RequiredArgsConstructor
public class RagService {
    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    // 리턴 타입을 Flux<String>으로 변경합니다.
    public Flux<String> askQuestionStream(String message) {

        SearchRequest searchRequest = SearchRequest.builder()
                .topK(6)              // 스트리밍은 속도가 생명이니 6개 정도로 조절해볼까요?
                .similarityThreshold(0.7)
                .build();

        // .stream().content()를 호출하면 Flux<String>이 반환됩니다.
        return chatClient.prompt()
                .advisors(QuestionAnswerAdvisor.builder(vectorStore)
                        .searchRequest(searchRequest)
                        .build())
                .user(message)
                .stream()
                .content();
    }
}