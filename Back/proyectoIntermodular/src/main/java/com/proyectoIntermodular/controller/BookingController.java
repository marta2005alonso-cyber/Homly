/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectoIntermodular.controller;

/**
 *
 * @author marta
 */
import com.proyectoIntermodular.model.Booking;
import com.proyectoIntermodular.service.BookingService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins ={"http://localhost:4200", "https://homly-gamma.vercel.app"})
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @GetMapping
    public List<Booking> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Booking getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Booking save(@RequestBody Booking booking) {
        return service.save(booking);
    }

    @PutMapping("/{id}")
    public Booking update(@PathVariable Long id, @RequestBody Booking booking) {
        return service.update(id, booking);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
    
    @PutMapping("/{id}/status")
    public Booking updateStatus(@PathVariable Long id, @RequestBody String status) {
        return service.updateStatus(id, status);
    }
    
    @GetMapping("/owner/{ownerId}")
    public List<Booking> getByOwnerId(@PathVariable Long ownerId) {
        return service.getByOwnerId(ownerId);
    }
    
    @GetMapping("/property/{propertyId}")
    public List<Booking> getByPropertyId(@PathVariable Long propertyId) {
        return service.getByPropertyId(propertyId);
    }
    
    


}