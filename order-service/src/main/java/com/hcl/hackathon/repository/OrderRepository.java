package com.hcl.hackathon.repository;

import org.springframework.data.jpa.repository.*;

import com.hcl.hackathon.entity.Order;
import com.hcl.hackathon.entity.Status;

import java.time.LocalDateTime;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT COUNT(o) FROM Order o")
    Long countTotalOrders();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status='APPROVED'")
    Double totalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status=:status")
    Long countByStatus(Status status);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.createdAt >= :start")
    Double todayRevenue(LocalDateTime start);
}