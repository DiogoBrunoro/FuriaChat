package com.furia.chat.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserDTO {
    private int id;
    private String fullName;
    @NotBlank
    private String email;
    private String username;
    @NotBlank
    private String password;
    private LocalDate birthday;
    private byte[] foto;
    private String descricao;
}
