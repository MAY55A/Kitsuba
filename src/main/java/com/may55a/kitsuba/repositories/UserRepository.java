package com.may55a.kitsuba.repositories;

import com.may55a.kitsuba.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Find user by email
    Optional<User> findByEmail(String email);

    // Check if a user exists by email
    boolean existsByEmail(String email);

    // Check if a user exists by username
    boolean existsByUsername(String userName);
}
