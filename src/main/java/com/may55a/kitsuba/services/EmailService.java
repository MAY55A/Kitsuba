package com.may55a.kitsuba.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final TemplateEngine templateEngine;


    @Value("${RESEND_API_KEY}")
    private String apiKey;

    @Async
    public void sendWelcomeEmail(
            String to,
            String username
    ) {

        try {

            Context context = new Context();

            context.setVariable("username", username);
            context.setVariable("year", LocalDate.now().getYear());

            String html = templateEngine.process(
                    "emails/Welcome",
                    context
            );

            String body = """
                    {
                      "from": "Kitsuba Team <noreply@kitsuba.app>",
                      "to": ["%s"],
                      "subject": "Welcome to Kitsuba!",
                      "html": %s
                    }
                    """.formatted(
                    to,
                    new ObjectMapper().writeValueAsString(html)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
