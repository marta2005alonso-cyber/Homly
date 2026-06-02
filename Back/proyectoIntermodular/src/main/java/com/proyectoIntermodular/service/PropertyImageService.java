/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.proyectoIntermodular.service;

/**
 *
 * @author marta
 */
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.proyectoIntermodular.model.Property;
import com.proyectoIntermodular.model.PropertyImage;
import com.proyectoIntermodular.repository.PropertyImageRepository;
import com.proyectoIntermodular.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class PropertyImageService {

    private final PropertyImageRepository imageRepository;
    private final PropertyRepository propertyRepository;
    private final Cloudinary cloudinary;

    public PropertyImageService(PropertyImageRepository imageRepository, PropertyRepository propertyRepository, Cloudinary cloudinary) {
        this.imageRepository = imageRepository;
        this.propertyRepository = propertyRepository;
        this.cloudinary = cloudinary;
    }

    public List<PropertyImage> getByPropertyId(Long propertyId) {
        return imageRepository.findByPropertyId(propertyId);
    }

    public PropertyImage upload(Long propertyId, MultipartFile file) throws IOException {
        Map result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String url = (String) result.get("secure_url");

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        PropertyImage image = new PropertyImage();
        image.setUrl(url);
        image.setProperty(property);
        return imageRepository.save(image);
    }

    public void delete(Long imageId) {
        imageRepository.deleteById(imageId);
    }
}
