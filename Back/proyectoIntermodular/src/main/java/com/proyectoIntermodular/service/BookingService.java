package com.proyectoIntermodular.service;

import com.proyectoIntermodular.model.Booking;
import com.proyectoIntermodular.repository.BookingRepository;
import com.proyectoIntermodular.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository repository;
    private final ReviewRepository reviewRepository;

    public BookingService(BookingRepository repository, ReviewRepository reviewRepository) {
        this.repository = repository;
        this.reviewRepository = reviewRepository;
    }

    public List<Booking> getAll() {
        return repository.findAll();
    }

    public Booking getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public Booking save(Booking booking) {
        System.out.println("offeredProperty: " + booking.getOfferedProperty());
        if (booking.getOfferedProperty() != null) {
            booking.setStatus("PENDING");
        } else {
            booking.setStatus("CONFIRMED");
        }
        return repository.save(booking);
    }

    public Booking update(Long id, Booking booking) {
        Booking existing = getById(id);
        existing.setCheckIn(booking.getCheckIn());
        existing.setCheckOut(booking.getCheckOut());
        existing.setNumberOfGuests(booking.getNumberOfGuests());
        existing.setTotalPrice(booking.getTotalPrice());
        return repository.save(existing);
    }
    public void delete(Long id) {
        reviewRepository.deleteByBookingId(id);
        repository.deleteById(id);
    }

    public Booking updateStatus(Long id, String status) {
        Booking booking = getById(id);
        booking.setStatus(status);
        repository.save(booking);

        if (status.equals("CONFIRMED") && booking.getOfferedProperty() != null) {
            Booking reverse = new Booking();
            reverse.setCheckIn(booking.getCheckIn());
            reverse.setCheckOut(booking.getCheckOut());
            reverse.setNumberOfGuests(booking.getNumberOfGuests());
            reverse.setTotalPrice(0);
            reverse.setStatus("CONFIRMED");
            reverse.setUser(booking.getProperty().getOwner());
            reverse.setProperty(booking.getOfferedProperty());
            repository.save(reverse);
        }

        return booking;
    }

    public List<Booking> getByOwnerId(Long ownerId) {
        return repository.findByPropertyOwnerId(ownerId);
    }

    public List<Booking> getByPropertyId(Long propertyId) {
        return repository.findByPropertyId(propertyId);
    }
}