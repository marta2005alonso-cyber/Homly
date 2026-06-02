/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.proyectoIntermodular.repository;
import com.proyectoIntermodular.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
/**
 *
 * @author marta
 */
public interface FavoriteRepository extends JpaRepository<Favorite, Long>{
    List<Favorite> findByUserId(Long userId);
}
