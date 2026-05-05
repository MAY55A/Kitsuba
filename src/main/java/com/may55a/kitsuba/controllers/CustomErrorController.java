package com.may55a.kitsuba.controllers;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class CustomErrorController implements ErrorController {

    private static final Logger log = LoggerFactory.getLogger(CustomErrorController.class);

    // Main error entry point (triggered automatically by Spring)
    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, HttpServletResponse response) {
        Object statusCode = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Throwable throwable = (Throwable) request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);
        String uri = (String) request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);

        int status = statusCode != null ? Integer.parseInt(statusCode.toString()) : 500;

        if (throwable != null) {
            log.error("Request {} failed with status {}: {}", uri, status, throwable.getMessage(), throwable);
        } else {
            log.warn("Request {} failed with status {} (no exception)", uri, status);
        }

        if (status == 404) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return "error/404";
        } else if (status == 401) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return "error/401";
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return "error/500";
        }
    }

    @GetMapping("/error/404")
    public String notFound(HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        return "error/404";
    }

    @GetMapping("/error/401")
    public String unauthorized(
            @RequestParam(name = "reason", required = false) String reason,
            HttpServletResponse response,
            Model model
    ) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        model.addAttribute("reason", reason);
        return "error/401";
    }

    @GetMapping("/error/500")
    public String internalError(HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        return "error/500";
    }
}