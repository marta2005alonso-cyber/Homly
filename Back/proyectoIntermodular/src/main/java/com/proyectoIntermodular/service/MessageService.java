/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectoIntermodular.service;

/**
 *
 * @author marta
 */
import com.proyectoIntermodular.model.Message;
import com.proyectoIntermodular.repository.MessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository repository;

    public MessageService(MessageRepository repository) {
        this.repository = repository;
    }

    public List<Message> getAll() {
        return repository.findAll();
    }

    public Message getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
    }

    public Message save(Message message) {
        return repository.save(message);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}