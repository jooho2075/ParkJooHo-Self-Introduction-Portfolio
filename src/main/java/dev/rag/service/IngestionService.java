package dev.rag.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

// 실제 경험(경력기술서 등)을 Document 객체로 만들고, 이를 ChromaDB(Vector Store)ㄴ에 저장하는 복잡한 작업을 수행
@Service
@RequiredArgsConstructor
public class IngestionService {
    private final VectorStore vectorStore;

    // resources/data 폴더의 .md 파일 가져오기
    @Value("classpath:data/*.md")
    private Resource[] resources;
    public void ingestData() {
        if(resources == null || resources.length == 0) {
            System.out.println(".md 파일이 resources/data 위치에 없습니다...ㅠㅠ");
            return;
        }

        for(Resource resource : resources) {
            // 1.Spring AI의 TextReader로 마크다운 파일 읽기
            TextReader reader = new TextReader(resource);

            // 2. 파일 내용을 문서(Document) 리스트로 변환
            var documents = reader.get();

            // 3.ChromaDB에 저장(이때 OpenAI 임메딩 모델 작동)
            vectorStore.add(documents);

            System.out.println("파일 주입 완료" + resource.getFilename());
        }
    }
}
