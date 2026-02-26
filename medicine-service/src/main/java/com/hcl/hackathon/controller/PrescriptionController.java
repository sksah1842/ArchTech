package com.hcl.hackathon.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.hackathon.entity.Prescription;
import com.hcl.hackathon.security.AdminUtil;
import com.hcl.hackathon.service.PrescriptionService;

@RestController
@RequestMapping("/prescriptions")
public class PrescriptionController {

    private final PrescriptionService service;

    public PrescriptionController(PrescriptionService service) {
        this.service = service;
    }

    // User upload
    @PostMapping
    public Prescription upload(@RequestBody Prescription p) {
        return service.upload(p);
    }

    // ADMIN approve
    @PutMapping("/{id}/approve")
    public Prescription approve(@PathVariable Long id) {
        AdminUtil.checkAdmin();
        return service.approve(id);
    }

    // ADMIN reject
    @PutMapping("/{id}/reject")
    public Prescription reject(@PathVariable Long id) {
        AdminUtil.checkAdmin();
        return service.reject(id);
    }
}