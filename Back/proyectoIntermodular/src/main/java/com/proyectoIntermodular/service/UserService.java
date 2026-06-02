/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectoIntermodular.service;

/**
 *
 * @author marta
 */
import com.proyectoIntermodular.model.Booking;
import com.proyectoIntermodular.model.Property;
import com.proyectoIntermodular.model.User;
import com.proyectoIntermodular.repository.BookingRepository;
import com.proyectoIntermodular.repository.PropertyRepository;
import com.proyectoIntermodular.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;
    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    
    public UserService(UserRepository repository, BookingRepository bookingRepository, PropertyRepository propertyRepository) {
        this.repository = repository;
        this.bookingRepository = bookingRepository;
        this.propertyRepository = propertyRepository;
    }

    public List<User> getAll() {
        return repository.findAll();
    }

    public User getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User save(User user) {
        return repository.save(user);
    }

    public User update(Long id, User user) {
        User existing = getById(id);
        existing.setName(user.getName());
        existing.setFirstName(user.getFirstName());
        existing.setSecondName(user.getSecondName());
        existing.setEmail(user.getEmail());
        existing.setPassword(user.getPassword());
        existing.setPhone(user.getPhone());
        existing.setCity(user.getCity());
        return repository.save(existing);
    }

    public void delete(Long id) {
        List<Booking> bookings = bookingRepository.findByUserId(id);
        for (Booking b : bookings) {
            bookingRepository.deleteById(b.getId());
        }
        List<Property> properties = propertyRepository.findByOwnerId(id);
        for (Property p : properties) {
            List<Booking> propertyBookings = bookingRepository.findByPropertyId(p.getId());
            for (Booking b : propertyBookings) {
                bookingRepository.deleteById(b.getId());
            }
            propertyRepository.deleteById(p.getId());
        }
        repository.deleteById(id);
    }
    
    public boolean hasActiveBookings(Long userId) {
        List<Booking> bookingsAsUser = bookingRepository.findByUserId(userId);
        List<Property> userProperties = propertyRepository.findByOwnerId(userId);

        for (Booking b : bookingsAsUser) {
            if (!b.getStatus().equals("CANCELLED")) {
                return true;
            }
        }

        for (Property p : userProperties) {
            List<Booking> propertyBookings = bookingRepository.findByPropertyId(p.getId());
            for (Booking b : propertyBookings) {
                if (!b.getStatus().equals("CANCELLED")) {
                    return true;
                }
            }
        }

        return false;
    }
    
    
    public void deleteWithProperties(Long id) {
        List<Property> userProperties = propertyRepository.findByOwnerId(id);
        for (Property p : userProperties) {
            propertyRepository.deleteById(p.getId());
        }
        repository.deleteById(id);
    }
}
