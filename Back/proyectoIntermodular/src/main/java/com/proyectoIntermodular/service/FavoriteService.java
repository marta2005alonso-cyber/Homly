/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectoIntermodular.service;

import com.proyectoIntermodular.model.Favorite;
import com.proyectoIntermodular.repository.FavoriteRepository;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 *
 * @author marta
 */
@Service

public class FavoriteService {
    private final FavoriteRepository repository;

    public FavoriteService(FavoriteRepository repository) {
        this.repository = repository;
    }

    public List<Favorite> getByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    public Favorite save(Favorite favorite) {
        return repository.save(favorite);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
