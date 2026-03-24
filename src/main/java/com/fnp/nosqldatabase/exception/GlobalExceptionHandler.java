package com.fnp.nosqldatabase.exception;


import com.fnp.nosqldatabase.dto.ExceptionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;

@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(IOException.class)
    public ResponseEntity<ExceptionResponse> handleException(IOException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ExceptionResponse.getResponse(e));
    }

    @ExceptionHandler(NoEntryInDatabaseException.class)
    public ResponseEntity<ExceptionResponse> handleException(NoEntryInDatabaseException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ExceptionResponse.getResponse(e));
    }

    @ExceptionHandler(IndexOutOfBoundsException.class)
    public ResponseEntity<ExceptionResponse> handleIndexOutOfBoundsException(IndexOutOfBoundsException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ExceptionResponse.getResponse(e));
    }
}
