package com.furia.chat.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furia.chat.entites.UserEntity;
import com.furia.chat.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetUserService {

    @Autowired
    private UserRepository UserRepository;

    public UserEntity get(int id) {
        return UserRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
    }


    public Optional<UserEntity> getByFullNameAndUsername(String fullName, String username) {
        return UserRepository.findByFullNameAndUsername(fullName, username);
    }

}

