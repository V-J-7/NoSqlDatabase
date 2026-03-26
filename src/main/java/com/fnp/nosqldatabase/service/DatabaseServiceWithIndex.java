package com.fnp.nosqldatabase.service;


import com.fnp.nosqldatabase.constants.BTree;
import com.fnp.nosqldatabase.constants.Node;
import com.fnp.nosqldatabase.exception.NoEntryInDatabaseException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class DatabaseServiceWithIndex {

    @Autowired
    FileServiceWithIndex fileServiceWithIndex;

    @PostConstruct
    public void init() throws IOException, ClassNotFoundException {
        fileServiceWithIndex.loadTree();

    }

    public List<Node> readFromDatabase(String username) {
        List<Node> ans = fileServiceWithIndex.search(username);
        if (ans == null) throw new NoEntryInDatabaseException("No records found");

        return ans;
    }

    public List<Node> getAllFromDatabase(int numberOfElements) {

        List<Node> records = fileServiceWithIndex.getAll();
        List<Node> result = new ArrayList<>();

        int size = getSizeOfDatabase();

        if (numberOfElements > size) {
            numberOfElements = size;
        }


        for (int i = 0; i < numberOfElements; i++) {
            result.add(records.get(i));
        }
        return result;
    }

    public int getSizeOfDatabase() {
        return fileServiceWithIndex.getAll().size();
    }

    public void insertManyToDatabase(List<Map<String, String>> data) throws IOException {
        fileServiceWithIndex.addManyToFile(data);
    }
}
