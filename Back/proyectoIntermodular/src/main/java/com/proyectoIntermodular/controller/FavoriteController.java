/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectoIntermodular.controller;

import com.proyectoIntermodular.model.Favorite;
import com.proyectoIntermodular.service.FavoriteService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
/**
 *
 * @author marta
 */
@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = {"http://localhost:4200", "https://homly-gamma.vercel.app"})
public class FavoriteController {
    private final FavoriteService service;

    public FavoriteController(FavoriteService service) {
        this.service = service;
    }

    @GetMapping("/user/{userId}")
    public List<Favorite> getByUserId(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }

    @PostMapping
    public Favorite save(@RequestBody Favorite favorite) {
        return service.save(favorite);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
