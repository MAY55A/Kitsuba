package com.may55a.kitsuba.models;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class CustomUserDetails implements UserDetails {

    private final String description;
    private String email;
    private String password;
    private String userName;
    private String profilePicture;
    private LearningStats learningStats;
    private Set<GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.userName = user.getUsername();
        this.profilePicture = user.getProfilePicture();
        this.description = user.getDescription();
        this.learningStats = user.getLearningStats();
        this.authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.toString()))
                .collect(Collectors.toSet());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}