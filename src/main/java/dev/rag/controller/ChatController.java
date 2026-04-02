package dev.rag.controller;

import dev.rag.dto.ChatRequest;
import dev.rag.dto.ChatResponse;
import dev.rag.service.RagService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/*
* 실시간 채팅 창구입니다. React 랜딩 페이지의 프롬프트에 사용자가 질문을 입력하면, 이를 받아 답변을 리턴
*
* */
@RestController
@RequiredArgsConstructor
public class ChatController {
    private final RagService ragService;

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        return ragService.askQuestion(request.getMessage());
    }
}
