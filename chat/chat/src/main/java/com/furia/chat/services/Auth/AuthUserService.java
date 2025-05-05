package com.furia.chat.services.Auth;

import java.time.Duration;
import java.time.Instant;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.furia.chat.dto.AuthUserDTO;
import com.furia.chat.dto.AuthUserResponseDTO;
import com.furia.chat.entites.UserEntity;
import com.furia.chat.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthUserResponseDTO auth(AuthUserDTO authUserDTO) throws Exception {
        UserEntity User = userRepository.findByEmail(authUserDTO.getEmail())
            .orElseThrow(() -> new Exception("User not found"));

        boolean passwordMatch = passwordEncoder.matches(authUserDTO.getPassword(), User.getPassword());
        if (!passwordMatch) {
            throw new Exception("Invalid password");
        }

        return getAuthUserResponseDTO(User);
    }

    private AuthUserResponseDTO getAuthUserResponseDTO(UserEntity User) {
        Algorithm algorithm = Algorithm.HMAC256("secret");

        String token = generateToken(User, algorithm);

        return AuthUserResponseDTO.builder()
                .access_token(token)
                .userId(User.getId())
                .build();
    }


    private String generateToken(UserEntity User, Algorithm algorithm) {
        return JWT.create()
                .withIssuer("furia")
                .withClaim("userId", User.getId())
                .withClaim("email", User.getEmail())
                .withExpiresAt(Instant.now().plus(Duration.ofHours(2)))
                .sign(algorithm);
    }


    public String updatePassword(AuthUserDTO authUserDTO) throws Exception {
        UserEntity User = userRepository.findByEmail(authUserDTO.getEmail())
            .orElseThrow(() -> new Exception("User not found"));

        User.setPassword(passwordEncoder.encode(authUserDTO.getPassword()));
        userRepository.save(User);

        return "Password updated";
    }

}

