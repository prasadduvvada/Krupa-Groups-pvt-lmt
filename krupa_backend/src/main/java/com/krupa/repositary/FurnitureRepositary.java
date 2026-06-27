package com.krupa.repositary;

import com.krupa.model.Furniture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FurnitureRepositary extends JpaRepository<Furniture , Long> {
}
