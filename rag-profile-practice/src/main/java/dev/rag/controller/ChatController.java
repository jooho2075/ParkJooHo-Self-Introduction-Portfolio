package dev.rag.controller;

import dev.rag.dto.ChatRequest;
import dev.rag.service.RagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
// 리액트(Vite) 기본 포트인 5173과의 통신을 허용합니다.
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ChatController {

    private final RagService ragService;

    /**
     * SSE(Server-Sent Events) 방식을 이용한 스트리밍 채팅
     * produces 설정이 있어야 브라우저가 데이터를 실시간으로 끊어서 읽습니다.
     */
    @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatStream(@RequestBody ChatRequest request) {
        // 🌟 [원상복구] 이제 질문(Question) 하나만 서비스로 전달합니다.
        // DTO의 구조에 따라 request.getQuestion() 또는 request.getMessage()를 사용하세요.
        return ragService.askQuestionStream(request.getQuestion());
    }
}