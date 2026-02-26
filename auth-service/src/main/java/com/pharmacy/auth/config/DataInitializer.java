package com.pharmacy.auth.config;

import com.pharmacy.auth.entity.Role;
import com.pharmacy.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {

        if (roleRepository.findByRoleName("USER").isEmpty()) {
            roleRepository.save(Role.builder().roleName("USER").build());
        }

        if (roleRepository.findByRoleName("ADMIN").isEmpty()) {
            roleRepository.save(Role.builder().roleName("ADMIN").build());
        }

        if (roleRepository.findByRoleName("MANAGER").isEmpty()) {
            roleRepository.save(Role.builder().roleName("MANAGER").build());
        }

        System.out.println("Default roles inserted.");
    }
}