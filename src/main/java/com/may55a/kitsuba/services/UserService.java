package com.may55a.kitsuba.services;

import com.may55a.kitsuba.dto.UserUpdateDTO;
import com.may55a.kitsuba.models.*;
import com.may55a.kitsuba.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    public User registerUser(String email, String userName, String password) throws IllegalArgumentException {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use.");
        }
        if (userRepository.existsByUsername(userName)) {
            throw new IllegalArgumentException("User name already in use.");
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(userName);
        user.setPassword(passwordEncoder.encode(password));
        user.setAuthProvider(AuthProvider.LOCAL);
        user.addRole(UserRole.USER);
        user.setLearningStats(new LearningStats());

        return userRepository.save(user);
    }

    public User getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = "";
        if (authentication.getPrincipal() instanceof CustomUserDetails) {
            email = ((CustomUserDetails) authentication.getPrincipal()).getEmail();
        } else if (authentication.getPrincipal() instanceof CustomOAuth2User) {
            email = ((CustomOAuth2User) authentication.getPrincipal()).getAttribute("email");
        } else if (authentication.getPrincipal() instanceof DefaultOidcUser) {
            email = ((DefaultOidcUser) authentication.getPrincipal()).getEmail();
        } else {
            throw new RuntimeException("Unknown UserDetails type: " + authentication.getPrincipal().getClass());
        }
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                    return customOAuth2UserService.createUser(oAuth2User);
                });

        return user;
    }

    public LearningStats getLearningStats() {
        User user = getLoggedInUser();
        return user.getLearningStats();
    }

    public List<String> getFavourites() {
        User user = getLoggedInUser();
        String favourites = user.getFavourites();
        return favourites.isEmpty() ? new ArrayList<>() : Arrays.stream(user.getFavourites().split(", ")).toList();
    }

    public void updateUser(UserUpdateDTO updatedData) {
        User existingUser = getLoggedInUser();

        if (updatedData.getUsername() != null)
            existingUser.setUsername(updatedData.getUsername());

        if (updatedData.getDescription() != null)
            existingUser.setDescription(updatedData.getDescription());

        if (updatedData.getProfilePicture() != null)
            existingUser.setProfilePicture(updatedData.getProfilePicture());

        if (updatedData.getLearningStats() != null)
            existingUser.setLearningStats(updatedData.getLearningStats());

        if (updatedData.getFavourites() != null)
            existingUser.setFavourites(updatedData.getFavourites());

        userRepository.save(existingUser);
    }

    public void updateUsernameAndEmail(Map<String, String> updatedData) {
        User existingUser = getLoggedInUser();
        String userName = updatedData.get("username");
        String email = updatedData.get("email");
        if (userName != null && !userName.equals(existingUser.getUsername())) {
            if (userRepository.existsByUsername(userName)) {
                throw new IllegalArgumentException("User name already in use.");
            } else {
                existingUser.setUsername(userName);
            }
        }

        if (email != null && !email.equals(existingUser.getEmail())) {
            if (userRepository.existsByEmail(email)) {
                throw new IllegalArgumentException("Email already in use.");
            } else {
                existingUser.setEmail(email);
            }
        }

        userRepository.save(existingUser);
    }

    public void updatePassword(String newPassword) {
        User existingUser = getLoggedInUser();
        if (newPassword != null) {
            String encodedPassword = passwordEncoder.encode(newPassword);
            if (encodedPassword.equals(existingUser.getPassword())) {
                throw new IllegalArgumentException("Same old password entered.");
            } else {
                existingUser.setPassword(encodedPassword);
                userRepository.save(existingUser);
            }
        } else {
            throw new IllegalArgumentException("Invalid password.");
        }
    }

    @Transactional
    public void deleteUser() {
        User currentUser = getLoggedInUser();
        userRepository.delete(currentUser);
    }

}
