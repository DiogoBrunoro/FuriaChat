package com.furia.chat.services;

import org.springframework.stereotype.Service;

import com.furia.chat.config.SecurityConfig;
import com.furia.chat.dto.UserDTO;
import com.furia.chat.entites.UserEntity;
import com.furia.chat.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CadastroUserService {

    private final UserRepository userRepository;
    private final SecurityConfig securityConfig;

    public UserEntity cadastrar(UserDTO userDTO) {
        String senhaCripto = securityConfig.passwordEncoder().encode(userDTO.getPassword());
        UserEntity userEntity = builderUserEntity(userDTO, senhaCripto);
        return userRepository.save(userEntity);
    }
    
    
    private UserEntity builderUserEntity(UserDTO userDTO, String senhaCripto) {
        return UserEntity.builder()
                .fullName(userDTO.getFullName())
                .email(userDTO.getEmail())
                .username(userDTO.getUsername())
                .birthday(userDTO.getBirthday())
                .password(senhaCripto)
                .build();
    }

    
    
}
