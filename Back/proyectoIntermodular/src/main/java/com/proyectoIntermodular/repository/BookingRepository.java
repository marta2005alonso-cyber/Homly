/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.proyectoIntermodular.repository;

/**
 *
 * @author marta
 */
import com.proyectoIntermodular.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByPropertyOwnerId(Long ownerId);
    List<Booking> findByUserId(Long userId);
    List<Booking> findByPropertyId(Long propertyId);

}
