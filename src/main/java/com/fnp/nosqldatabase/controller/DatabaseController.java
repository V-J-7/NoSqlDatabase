package com.fnp.nosqldatabase.controller;


import com.fnp.nosqldatabase.constants.Node;
import com.fnp.nosqldatabase.dto.SuccessResponse;
import com.fnp.nosqldatabase.service.DatabaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
@Tag(name = "Database without index" ,description = "Perform read and create on database without index")
public class DatabaseController {

    @Autowired
    DatabaseService databaseService;

    @GetMapping("/get")
    @Operation(summary = "Read from data by a key value pair")
    public ResponseEntity<SuccessResponse> get(
            @RequestParam String key,
            @RequestParam String value) {

        Long startTime = System.nanoTime();
        List<Node> ans = databaseService.readFromDatabase(key, value);
        Long endTime = System.nanoTime();
        Long responseTime = (endTime-startTime)/1_000_000;

        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.getResponse(ans, responseTime));
    }

    @GetMapping("/get-all")
    @Operation(summary = "Get n entries from the database")
    public ResponseEntity<SuccessResponse> getAll(
            @RequestParam(value = "size", defaultValue = "10") int pageSize
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.getResponse(databaseService.getAllFromDatabase(pageSize), null));
    }

    @GetMapping("/get-size")
    @Operation(summary = "Get the number of entries in the database")
    public ResponseEntity<SuccessResponse> getNumberOfEntries() {
        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.getResponse(databaseService.getSizeOfDatabase(), null));
    }

    @PostMapping("/insert-many")
    @Operation(summary = "Insert multiple entries in the database")
    public ResponseEntity<SuccessResponse> insertAll(@RequestBody List<Map<String, String>> entries) throws IOException {
        Long startTime = System.nanoTime();
        databaseService.insertManyToDatabase(entries);
        Long endTime = System.nanoTime();

        Long responseTime = (endTime-startTime)/1_000_000;


        return ResponseEntity.status(HttpStatus.CREATED).body(SuccessResponse.getResponse("Added to database", responseTime));
    }

}
