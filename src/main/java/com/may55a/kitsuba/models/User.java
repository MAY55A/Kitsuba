package com.may55a.kitsuba.models;

import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "users")
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

    @ToString.Exclude
    @JsonIgnore
    @Column(nullable = true)
    private String password;

    @Column
    private String profilePicture = "http://localhost:8080/images/avatars/default_avatar.png";

    @Column
    private String description;

    @Column(columnDefinition = "TEXT")
    private String favourites = "";

    @CreationTimestamp
    @Column(columnDefinition = "TIMESTAMPTZ", updatable = false)
    private OffsetDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider authProvider;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType accountType = AccountType.FREE;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "role"})
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Set<UserRole> roles = new HashSet<>();

    @Embedded
    private LearningStats learningStats;

    public void addRole(UserRole role) {
        roles.add(role);
    }

}
