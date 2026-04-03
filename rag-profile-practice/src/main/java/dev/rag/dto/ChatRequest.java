package dev.rag.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter; // 👈 추가

/**
 * React에서 보낼 질문 데이터의 구조 클래스
 */
@Getter
@Setter // 👈 이걸 붙이면 아래에 수동으로 만든 Getter/Setter가 필요 없어요!
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    private String question;
    private String lang;

    // React 코드에서 .question 대신 .message로 보낼 경우를 대비한 별칭 메서드
    public String getMessage() {
        return this.question;
    }
}