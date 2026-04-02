package dev.rag.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/*
* React에서 보낼 질문 데이터의 구조 클래스
* */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    private String question;
}
