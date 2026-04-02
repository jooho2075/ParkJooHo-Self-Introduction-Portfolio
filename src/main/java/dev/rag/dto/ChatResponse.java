package dev.rag.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// AI가 생성한 답변과 검색된 참고 문헌 등을 담아 React로 돌려줄 구조
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String answer; // AI가 생성한 답변
    // private String source(검색 데이터 출처 넣고 싶을 때 확장 가능)
}
