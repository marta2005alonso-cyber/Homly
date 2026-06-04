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
import com.proyectoIntermodular.repository.BookingRepository;
import com.proyectoIntermodular.repository.PropertyRepository;
import com.proyectoIntermodular.repository.PropertyImageRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import com.proyectoIntermodular.repository.ReviewRepository;

@Service
public class PropertyService {

    private final PropertyRepository repository;
    private final PropertyImageRepository imageRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    public PropertyService(PropertyRepository repository, PropertyImageRepository imageRepository, BookingRepository bookingRepository, ReviewRepository reviewRepository) {
        this.repository = repository;
        this.imageRepository = imageRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
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

    @Transactional
    public void delete(Long id) {
        List<Booking> bookings = bookingRepository.findByPropertyId(id);
        boolean hasActiveBookings = bookings.stream()
            .anyMatch(b -> ("CONFIRMED".equals(b.getStatus()) || "PENDING".equals(b.getStatus()))
                && !b.getCheckOut().isBefore(java.time.LocalDate.now()));
        if (hasActiveBookings) {
            throw new RuntimeException("Este alojamiento tiene reservas asociadas");
        }
        for (Booking booking : bookings) {
            reviewRepository.deleteByBookingId(booking.getId());
            bookingRepository.deleteById(booking.getId());
        }
        imageRepository.deleteByPropertyId(id);
        repository.deleteById(id);
    }
}
