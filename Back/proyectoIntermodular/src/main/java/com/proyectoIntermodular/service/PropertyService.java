/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectoIntermodular.service;

/**
 *
 * @author marta
 */
import com.proyectoIntermodular.model.Property;
import com.proyectoIntermodular.repository.PropertyRepository;
import com.proyectoIntermodular.repository.PropertyImageRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository repository;
    private final PropertyImageRepository imageRepository;

    public PropertyService(PropertyRepository repository, PropertyImageRepository imageRepository) {
        this.repository = repository;
        this.imageRepository = imageRepository;
    }

    public List<Property> getAll() {
        return repository.findAll();
    }

    public Property getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
    }

    public Property save(Property property) {
        return repository.save(property);
    }

    public Property update(Long id, Property property) {
        Property existing = getById(id);
        existing.setName(property.getName());
        existing.setDescription(property.getDescription());
        existing.setAddress(property.getAddress());
        existing.setCity(property.getCity());
        existing.setCountry(property.getCountry());
        existing.setMaxGuests(property.getMaxGuests());
        existing.setPricePerNight(property.getPricePerNight());
        existing.setEntryTime(property.getEntryTime());
        existing.setDepartureTime(property.getDepartureTime());
        return repository.save(existing);
    }

    public void delete(Long id) {
        imageRepository.deleteByPropertyId(id);
        repository.deleteById(id);
    }
}
