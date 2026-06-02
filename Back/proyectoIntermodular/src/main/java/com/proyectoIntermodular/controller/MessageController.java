/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectoIntermodular.controller;

/**
 *
 * @author marta
 */
import com.proyectoIntermodular.model.Message;
import com.proyectoIntermodular.service.MessageService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:4200")
public class MessageController {

    private final MessageService service;

    public MessageController(MessageService service) {
        this.service = service;
    }

    @GetMapping
    public List<Message> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Message getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Message save(@RequestBody Message message) {
        return service.save(message);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
