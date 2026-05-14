package com.may55a.kitsuba.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

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

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("Kitsuba Team <noreply@kitsuba.app>");
            helper.setTo(to);
            helper.setSubject("Welcome to Kitsuba !");

            helper.setText(html, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
