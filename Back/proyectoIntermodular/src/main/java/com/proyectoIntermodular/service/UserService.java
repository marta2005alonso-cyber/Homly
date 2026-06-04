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
import com.proyectoIntermodular.repository.ReviewRepository;
import com.proyectoIntermodular.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.proyectoIntermodular.repository.PropertyImageRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;
    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final ReviewRepository reviewRepository;
    private final PropertyImageRepository imageRepository;

    public UserService(UserRepository repository, BookingRepository bookingRepository, PropertyRepository propertyRepository, ReviewRepository reviewRepository, PropertyImageRepository imageRepository) {
        this.repository = repository;
        this.bookingRepository = bookingRepository;
        this.propertyRepository = propertyRepository;
        this.reviewRepository = reviewRepository;
        this.imageRepository = imageRepository;
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

    @Transactional
    public void delete(Long id) {
        // Comprobar reservas activas futuras como inquilino
        List<Booking> bookingsAsUser = bookingRepository.findByUserId(id);
        for (Booking b : bookingsAsUser) {
            if (b.getCheckOut() != null && 
                !b.getCheckOut().isBefore(java.time.LocalDate.now()) &&
                "CONFIRMED".equals(b.getStatus())) {
                throw new RuntimeException("Tienes reservas activas. Cancélalas antes.");
            }
        }

        // Comprobar reservas activas futuras en propiedades del usuario
        List<Property> properties = propertyRepository.findByOwnerId(id);
        for (Property p : properties) {
            List<Booking> propertyBookings = bookingRepository.findByPropertyId(p.getId());
            for (Booking b : propertyBookings) {
                if (b.getCheckOut() != null &&
                    !b.getCheckOut().isBefore(java.time.LocalDate.now()) &&
                    "CONFIRMED".equals(b.getStatus())) {
                    throw new RuntimeException("Tienes reservas activas en tus propiedades. Cancélalas antes.");
                }
            }
        }

        // Borrar reservas pasadas del usuario como inquilino (con reseñas)
        for (Booking b : bookingsAsUser) {
            reviewRepository.deleteByBookingId(b.getId());
            bookingRepository.deleteById(b.getId());
        }

        // Borrar propiedades con sus reservas pasadas, reseñas e imágenes
        for (Property p : properties) {
            List<Booking> propertyBookings = bookingRepository.findByPropertyId(p.getId());
            for (Booking b : propertyBookings) {
                reviewRepository.deleteByBookingId(b.getId());
                bookingRepository.deleteById(b.getId());
            }
            imageRepository.deleteByPropertyId(p.getId());
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
