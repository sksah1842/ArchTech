package com.hcl.hackathon.dto;

import lombok.*;
import java.util.List;

@Data

public class PlaceOrderRequest {
    private Long userId;
    private List<OrderItemRequest> items;
}
