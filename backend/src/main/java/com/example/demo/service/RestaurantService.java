package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.demo.entity.Restaurant;
import com.example.demo.repository.RestaurantRepository;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    public List<Restaurant> getAll() {
        return restaurantRepository.findAll();
    }

    public Optional<Restaurant> getById(Integer id) {
        return restaurantRepository.findById(id);
    }

    public Restaurant save(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public void delete(Integer id) {
        restaurantRepository.deleteById(id);
    }



    public List<Restaurant> getByStatus(String status) {
        return restaurantRepository.findByStatus(status);
    }

    public List<Restaurant> getByParentId(Integer parentId) {
        return restaurantRepository.findByParentId(parentId);
    }
}

