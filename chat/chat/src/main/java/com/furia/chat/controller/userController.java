package com.furia.chat.controller;

import java.io.IOException;
import java.net.URI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import com.furia.chat.dto.PerfilUpdateDTO;
import com.furia.chat.dto.UserDTO;
import com.furia.chat.entites.UserEntity;
import com.furia.chat.repository.UserRepository;
import com.furia.chat.services.CadastroUserService;
import com.furia.chat.services.GetUserService;
import com.furia.chat.services.UserService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class userController {

    private final CadastroUserService cadastroUserService;
    private final GetUserService getUserService;
    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping("/cadastrar")
    public ResponseEntity<Object> cadastrar(@RequestBody @Valid UserDTO userDTO, UriComponentsBuilder uriBuilder) {
        URI uri = uriBuilder.path("/user/{id}").buildAndExpand(userDTO.getId()).toUri();
        return ResponseEntity.created(uri).body(cadastroUserService.cadastrar(userDTO));
    }

    @GetMapping("/buscarPorId/{id}")
    public ResponseEntity<Object> visualizar(@PathVariable int id) {
        try {
            UserEntity userEntity = getUserService.get(id);
            UserDTO userDTO = UserDTO.builder()
                    .id(userEntity.getId())
                    .fullName(userEntity.getFullName())
                    .email(userEntity.getEmail())
                    .username(userEntity.getUsername())
                    .birthday(userEntity.getBirthday())
                    .foto(userEntity.getFoto())
                    .descricao(userEntity.getDescricao())
                    .build();
            return ResponseEntity.ok(userDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Membro não encontrado");
        }
    }

    @PutMapping("/updateProfile/{id}")
    public ResponseEntity<Void> updateProfile(
            @PathVariable Integer id,
            @RequestParam("descricao") String descricao,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {
        
  
        PerfilUpdateDTO perfilDTO = new PerfilUpdateDTO();
        perfilDTO.setDescricao(descricao);
      
        if (foto != null && !foto.isEmpty()) {
            try {
                perfilDTO.setFoto(foto.getBytes());  
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
    
        // Atualiza o perfil
        userService.atualizarFotoEDescricao(id, perfilDTO);
        return ResponseEntity.ok().build();
    }
    

}
