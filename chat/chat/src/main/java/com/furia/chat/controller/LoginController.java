package com.furia.chat.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.furia.chat.dto.AuthUserDTO;
import com.furia.chat.services.Auth.AuthUserService;

import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class LoginController {

    private final AuthUserService authUserService;

    @PostMapping
    public ResponseEntity<Object> login(@RequestBody AuthUserDTO authUserDTO) {
        try {
            return ResponseEntity.ok(authUserService.auth(authUserDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<Object> updatePassword(@RequestBody AuthUserDTO authUserDTO) {
        try {
            return ResponseEntity.ok(authUserService.updatePassword(authUserDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

}
