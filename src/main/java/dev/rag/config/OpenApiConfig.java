package dev.rag.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI springOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("박주호 프로필 포트폴리오 RAG API")
                        .version("1.0")
                        .description("Spring AI와 ChromaDB를 활용한 박주호 개발자 프로필 챗봇 API 문서입니다."));
    }
}