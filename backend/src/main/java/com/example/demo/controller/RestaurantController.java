package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Restaurant;
import com.example.demo.service.RestaurantService;

import java.util.List;

@RestController
@RequestMapping("/api/restaurant")
@CrossOrigin("*")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping
    public List<Restaurant> getAll() {
        return restaurantService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getById(@PathVariable Integer id) {
        return restaurantService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Restaurant create(@RequestBody Restaurant restaurant) {
        return restaurantService.save(restaurant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> update(@PathVariable Integer id, @RequestBody Restaurant restaurantDetails) {
        return restaurantService.getById(id).map(restaurant -> {
            restaurant.setTen(restaurantDetails.getTen());
            restaurant.setSdt(restaurantDetails.getSdt());
            restaurant.setDiaChi(restaurantDetails.getDiaChi());
            restaurant.setMoTa(restaurantDetails.getMoTa());
            restaurant.setStatus(restaurantDetails.getStatus());
            restaurant.setParentId(restaurantDetails.getParentId());
            return ResponseEntity.ok(restaurantService.save(restaurant));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        restaurantService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{status}")
    public List<Restaurant> getByStatus(@PathVariable String status) {
        return restaurantService.getByStatus(status);
    }

    @GetMapping("/parent/{parentId}")
    public List<Restaurant> getByParentId(@PathVariable Integer parentId) {
        return restaurantService.getByParentId(parentId);
    }
}

