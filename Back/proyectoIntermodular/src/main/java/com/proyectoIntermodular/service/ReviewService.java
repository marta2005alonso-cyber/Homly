/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectoIntermodular.service;

/**
 *
 * @author marta
 */
import com.proyectoIntermodular.model.Review;
import com.proyectoIntermodular.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository repository;

    public ReviewService(ReviewRepository repository) {
        this.repository = repository;
    }

    public List<Review> getAll() {
        return repository.findAll();
    }

    public Review getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }

    public Review save(Review review) {
        return repository.save(review);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
    
    public Review update(Long id, Review review) {
        Review existing = getById(id);
        existing.setRating(review.getRating());
        existing.setComment(review.getComment());
        existing.setDate(review.getDate());
        return repository.save(existing);
    }   
}
