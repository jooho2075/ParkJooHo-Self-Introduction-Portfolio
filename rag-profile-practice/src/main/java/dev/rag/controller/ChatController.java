package dev.rag.controller;

import dev.rag.service.RagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // 리액트(5173)와의 통신을 위해 필수!
public class ChatController {

    private final RagService ragService;

    /**
     * SSE(Server-Sent Events) 방식을 이용한 스트리밍 채팅
     * produces 설정이 있어야 브라우저가 데이터를 실시간으로 끊어서 읽습니다.
     */
    @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatStream(@RequestBody ChatRequest request) {
        // RagService에서 만든 Flux<String>을 그대로 반환합니다.
        return ragService.askQuestionStream(request.getQuestion());
    }
}

// 요청 데이터를 받기 위한 간단한 DTO (기존에 있다면 그대로 쓰시면 됩니다)
class ChatRequest {
    private String question;
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}