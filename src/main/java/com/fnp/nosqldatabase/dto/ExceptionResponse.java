package com.fnp.nosqldatabase.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExceptionResponse {
    @Builder.Default
    private String status = "success";
    private String message;

    public static ExceptionResponse getResponse(Exception e) {
        return ExceptionResponse.builder()
                .message(e.getMessage())
                .build();
    }
}
