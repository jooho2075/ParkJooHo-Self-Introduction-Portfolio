package dev.rag.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/*
* CORS(Cross-Origin Resource Sharing) 설정을 담당
* React 프론트엔드와 Spring Boot 백엔드 간의 통신을 위한 설정 클래스
* */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 경로 설정 적용
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // React localhost 연결
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Get(조회), POST(주입,질문)등 사용할 모든 HTTP 메서드 허용
                .allowedHeaders("*") // 헤더 정보를 통해 유연한 통신 허용
                .allowCredentials(true); // 쿠키나 인증 정보를 포함한 요청도 허용하려면 true 설정
    }
}
