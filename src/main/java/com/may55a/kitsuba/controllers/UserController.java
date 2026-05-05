package com.may55a.kitsuba.controllers;

import com.may55a.kitsuba.dto.UserUpdateDTO;
import com.may55a.kitsuba.models.LearningStats;
import com.may55a.kitsuba.models.User;
import com.may55a.kitsuba.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile() {
        return ResponseEntity.ok(userService.getLoggedInUser());
    }

    @GetMapping("/learningStats")
    public ResponseEntity<LearningStats> getLearningStats() {
        return ResponseEntity.ok(userService.getLearningStats());
    }

    @GetMapping("/favourites")
    public ResponseEntity<List<String>> getFavourites() {
        return ResponseEntity.ok(userService.getFavourites());
    }

    @PatchMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody UserUpdateDTO data) {
        try {
            userService.updateUser(data);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PutMapping("/update-account")
    public ResponseEntity<?> updateAccount(@RequestBody Map<String, String> body) {
        try {
            userService.updateUsernameAndEmail(body);
            return ResponseEntity.ok("Account updated successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> body) {
        try {
            userService.updatePassword(body.get("newPassword"));
            return ResponseEntity.ok("Password updated successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @DeleteMapping("/account")
    public ResponseEntity<Void> deleteUser(HttpServletRequest request,
                                           HttpServletResponse response) {
        userService.deleteUser();

        SecurityContextHolder.clearContext();
        new SecurityContextLogoutHandler().logout(request, response, null);

        return ResponseEntity.noContent().build();
    }
}
