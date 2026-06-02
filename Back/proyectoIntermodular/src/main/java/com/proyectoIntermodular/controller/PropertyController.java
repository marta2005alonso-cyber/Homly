/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectoIntermodular.controller;

/**
 *
 * @author marta
 */
import com.proyectoIntermodular.model.Property;
import com.proyectoIntermodular.service.PropertyService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = {"http://localhost:4200", "https://homly-gamma.vercel.app"})
public class PropertyController {

    private final PropertyService service;

    public PropertyController(PropertyService service) {
        this.service = service;
    }

    @GetMapping
    public List<Property> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Property getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Property save(@RequestBody Property property) {
        return service.save(property);
    }

    @PutMapping("/{id}")
    public Property update(@PathVariable Long id, @RequestBody Property property) {
        return service.update(id, property);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
