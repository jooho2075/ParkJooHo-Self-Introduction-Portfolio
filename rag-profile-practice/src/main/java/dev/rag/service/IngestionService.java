package dev.rag.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class IngestionService {

    private final VectorStore vectorStore;

    // classpath:data/ 하위의 모든 .md 파일을 찾습니다.
    @Value("classpath:data/**/*.md")
    private Resource[] resources;

    public void ingestData() {
        // 리소스 로딩 안전장치
        if (resources == null || resources.length == 0) {
            try {
                resources = new PathMatchingResourcePatternResolver()
                        .getResources("classpath:data/**/*.md");
            } catch (IOException e) {
                System.out.println("파일을 읽는 중 오류가 발생했습니다: " + e.getMessage());
            }
        }

        if (resources == null || resources.length == 0) {
            System.out.println(".md 파일이 resources/data 또는 그 하위 폴더에 없습니다!");
            return;
        }

        for (Resource resource : resources) {
            try {
                // 1. TextReader로 마크다운 파일 읽기
                TextReader reader = new TextReader(resource);

                // 2. 문서(Document) 리스트로 변환 및 VectorStore 저장
                var documents = reader.get();
                vectorStore.add(documents);

                System.out.println("파일 주입 완료: " + resource.getFilename());
            } catch (Exception e) {
                System.out.println("파일 주입 중 오류 발생 (" + resource.getFilename() + "): " + e.getMessage());
            }
        }
        System.out.println("모든 데이터 주입 프로세스가 완료되었습니다!");
    }
}