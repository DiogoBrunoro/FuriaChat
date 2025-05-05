package com.furia.chat.services;

import java.io.IOException;
import java.util.Optional;  // Corrigido para importar de java.util

import org.springframework.stereotype.Service;

import com.furia.chat.dto.PerfilUpdateDTO;
import com.furia.chat.entites.UserEntity;
import com.furia.chat.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final GetUserService getUserService; 

    public void atualizarFotoEDescricao(Integer id, PerfilUpdateDTO perfilDTO) {
        Optional<UserEntity> userOptional = userRepository.findById(id); 
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();

            // Atualiza a descrição
            if (perfilDTO.getDescricao() != null) {
                user.setDescricao(perfilDTO.getDescricao());
            }

            // Atualiza a foto, se presente
            if (perfilDTO.getFoto() != null) {
                user.setFoto(perfilDTO.getFoto());
            }

            // Salva o usuário com as atualizações
            userRepository.save(user);
        } else {
            throw new EntityNotFoundException("Usuário não encontrado.");
        }
    }
}
