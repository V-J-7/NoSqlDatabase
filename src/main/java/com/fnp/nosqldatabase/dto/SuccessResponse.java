package com.fnp.nosqldatabase.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SuccessResponse {

    @Builder.Default
    private String status = "success";

    private Object data;

    @JsonProperty("response_time")
    private Long responseTime;

    public static SuccessResponse getResponse(Object data, Long responseTime) {
        return SuccessResponse.builder()
                .data(data)
                .responseTime(responseTime)
                .build();
    }
}
