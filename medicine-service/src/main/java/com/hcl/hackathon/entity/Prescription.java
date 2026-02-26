package com.hcl.hackathon.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long medicineId;
    private String status; // PENDING / APPROVED / REJECTED

    // getters and setters
}