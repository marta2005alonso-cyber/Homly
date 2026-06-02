/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectoIntermodular.controller;

/**
 *
 * @author marta
 */
import com.proyectoIntermodular.model.User;
import com.proyectoIntermodular.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:4200", "https://homly-1mrvhmmgl-marta2005alonso-cybers-projects.vercel.app"})
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<User> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public User save(@RequestBody User user) {
        return service.save(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) {
        return service.update(id, user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
    
    @GetMapping("/{id}/hasActiveBookings")
    public boolean hasActiveBookings(@PathVariable Long id) {
        return service.hasActiveBookings(id);
    }
    
}