package com.example.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.webhooks.Webhook;


@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class ThanhToanController {

    private final PayOS payOS;
    private static final Logger logger = LoggerFactory.getLogger(ThanhToanController.class);

    public ThanhToanController(PayOS payOS) {
        this.payOS = payOS;
    }

    private ResponseEntity<ObjectNode> processPayment(PaymentRequest request) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode response = mapper.createObjectNode();

        try {
            long amount = request.getAmount();
            if (amount <= 0) {
                throw new IllegalArgumentException("Amount must be greater than 0");
            }

            CreatePaymentLinkRequest paymentRequest = CreatePaymentLinkRequest.builder()
                    .orderCode(System.currentTimeMillis() / 1000)
                    .amount(amount)
                    .description("Thanh toan don hang " + request.getOrderId())
                    .cancelUrl(request.getCancelUrl() != null && !request.getCancelUrl().isBlank()
                            ? request.getCancelUrl()
                            : "https://your-domain.com/cancel")
                    .returnUrl(request.getReturnUrl() != null && !request.getReturnUrl().isBlank()
                            ? request.getReturnUrl()
                            : "https://your-domain.com/success")
                    .build();

            var paymentLink = payOS.paymentRequests().create(paymentRequest);

            response.put("checkoutUrl", paymentLink.getCheckoutUrl());
            response.put("paymentUrl", paymentLink.getCheckoutUrl()); // For consistency with frontend
            response.put("orderCode", paymentLink.getOrderCode());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Create payment failed for orderId: " + request.getOrderId(), e);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/create-payment")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ObjectNode> createPayment(@RequestBody PaymentRequest request) {
        return processPayment(request);
    }

    @PostMapping("/create-payment-vnpay")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ObjectNode> createVnpayPayment(@RequestBody PaymentRequest request) {
        return processPayment(request);
    }

    @PostMapping("/create-payment-momo")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ObjectNode> createMomoPayment(@RequestBody PaymentRequest request) {
        return processPayment(request);
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody Webhook webhook) {
        try {
            var data = payOS.webhooks().verify(webhook);
            System.out.println("Thanh toán thành công: " + data.getOrderCode());
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            System.err.println("Webhook không hợp lệ: " + e.getMessage());
            return ResponseEntity.badRequest().body("Invalid webhook");
        }
    }
}
