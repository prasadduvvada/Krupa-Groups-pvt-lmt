package com.krupa.repositary;

import com.krupa.model.Projects;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepositary extends JpaRepository<Projects , Long> {
}
