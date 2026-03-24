package com.fnp.nosqldatabase.service;


import com.fnp.nosqldatabase.constants.Node;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class FileService {

    private final File file = new File("database.db");

    private List<Node> list;

    @PostConstruct
    public void loadList() throws IOException, ClassNotFoundException {
        if (list != null) return;

        if (!file.exists() || file.length() == 0) {
            file.createNewFile();
            list = new LinkedList<>();
            return;
        }

        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file))) {
            list = (List<Node>) ois.readObject();
        }
    }


    public void addToFile(Node node) throws IOException {

        list.add(node);
        flush();

    }

    public void addManyToFile(List<Map<String, String>> nodes) throws IOException {
        for (Map<String, String> map : nodes) {
            list.add(new Node(map));
        }

        flush();
    }

    private void flush() throws IOException {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(file))) {
            oos.writeObject(list);
        }
    }

    public List<Node> readFromFile() {
        return list;
    }

}
