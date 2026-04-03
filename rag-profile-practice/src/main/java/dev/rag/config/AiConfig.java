package dev.rag.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// OpenAI API 키 설정과 ChatClient 빈(Bean)을 생성
@Configuration
public class AiConfig {
    /*
    * ChatClient
    *  - Spring AI에서 LLM(OpenAI)과 대화하는 인터페이스
    *  - 인수로 들어오는 chatModel은 Spring이 application.yml 설정을 통해 자동 주입
    * */
    @Bean
    public ChatClient chatClient(OpenAiChatModel chatModel) {
        return ChatClient.builder(chatModel)
                .defaultSystem("만나서 반갑습니다. 박주호 프로필 페이지입니다." +
                        "궁금한 내용이 있다면 검색창을 활용해쥐면 감사하겠습니다")
                .build();
    }
}
