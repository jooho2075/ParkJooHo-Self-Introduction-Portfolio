package dev.rag.controller;

import dev.rag.service.IngestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// 경력 데이터를 DB에 넣는 클래스(AI가 생성한 답변을 React로 답해줌)
@Tag(name = "Ingestion Controller", description = "데이터 주입 및 관리 API")
@RestController
@RequiredArgsConstructor
public class IngestionController {
    private final IngestionService ingestionService;

    /*
    * 브라우저에서 localhost:8080/ingest 접속 시 실행됨
    * resources/data 폴더 내의 모든 .md 파일을 읽어 벡터DB에 저장
    * */
    @Operation(summary = "데이터 주입 실행", description = "로컬 마크다운 파일을 읽어 ChromaDB에 저장")
    @GetMapping("/ingest")
    public String ingest() {
        try{
            ingestionService.ingestData(); // Service 계층 주입 로직 호출
            return "프로필 데이터 ChromaDB 주입 완료";
        } catch(Exception e) {
            // 에러 발생 시 로그 메시지
            e.printStackTrace();
            return "데이터 주입 중 오류 발생" + e.getMessage();

        }
    }
}
