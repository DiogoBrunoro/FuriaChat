package com.furia.chat.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.furia.chat.entites.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByFullNameAndUsername(String fullName, String username);
    @Query(value = "SELECT * FROM membros WHERE MONTH(birthday) = :month", nativeQuery = true)
    List<UserEntity> findByBirthdayMonth(@Param("month") int month);


}

