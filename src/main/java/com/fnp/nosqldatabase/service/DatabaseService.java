package com.fnp.nosqldatabase.service;


import com.fnp.nosqldatabase.constants.Node;
import com.fnp.nosqldatabase.exception.NoEntryInDatabaseException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Slf4j
@Service
public class DatabaseService {

    @Autowired
    FileService fileService;
    
    @PostConstruct
    public void init() throws IOException {
        fileService.loadList();
    }

    public List<Node> readFromDatabase(String key, String value) {

        List<Node> list = fileService.readFromFile();
        List<Node> result = new ArrayList<>();
        log.info("Number of records found: {}", list.size());


        for (Node node : list) {

            Map<String, String> entry = node.getEntry();

            if (entry != null && entry.get(key) != null && entry.get(key).equals(value)) {
                result.add(node);
            }
        }

        if (result.isEmpty()) {
            throw new NoEntryInDatabaseException("No records found");
        }

        return result;
    }

    public List<Node> getAllFromDatabase(int numberOfElements) {
        List<Node> list = fileService.readFromFile();
        List<Node> result = new ArrayList<>();

        if (numberOfElements > list.size()) {
            numberOfElements = list.size();
        }

        for (int i = 0; i < numberOfElements; i++) {
            result.add(list.get(i));
        }

        return result;
    }

    public int getSizeOfDatabase() {
        return fileService.readFromFile().size();
    }

    public void insertManyToDatabase(List<Map<String, String>> map) throws IOException {
        fileService.addManyToFile(map);
    }

}
