/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectoIntermodular.controller;

/**
 *
 * @author marta
 */

import com.proyectoIntermodular.model.PropertyImage;
import com.proyectoIntermodular.service.PropertyImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = {"http://localhost:4200", "https://homly-gamma.vercel.app"})
public class PropertyImageController {

    private final PropertyImageService service;

    public PropertyImageController(PropertyImageService service) {
        this.service = service;
    }

    @GetMapping("/property/{propertyId}")
    public List<PropertyImage> getByProperty(@PathVariable Long propertyId) {
        return service.getByPropertyId(propertyId);
    }

    @PostMapping("/property/{propertyId}")
    public PropertyImage upload(@PathVariable Long propertyId, @RequestParam("file") MultipartFile file) throws IOException {
        return service.upload(propertyId, file);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
