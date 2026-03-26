package com.fnp.nosqldatabase.service;


import com.fnp.nosqldatabase.constants.Node;
import com.fnp.nosqldatabase.util.NodeSerializer;
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

    private final List<Node> list = new LinkedList<>();

    @PostConstruct
    public void loadList() throws IOException {
        if (!file.exists() || file.length() == 0) {
            file.createNewFile();
            return;
        }

        try (DataInputStream dis = new DataInputStream(new BufferedInputStream(new FileInputStream(file)))) {
            while (dis.available() > 0) {
                Node node = NodeSerializer.readNode(dis);
                list.add(node);
            }
        }

    }

    public void addManyToFile(List<Map<String, String>> nodes) throws IOException {
        try (DataOutputStream dos = new DataOutputStream(new BufferedOutputStream(new FileOutputStream(file, true)))) {
            for (Map<String, String> map : nodes) {
                Node newNode = new Node(map);
                list.add(newNode);
                NodeSerializer.writeNode(newNode, dos);
            }
        }
    }

    public List<Node> readFromFile() {
        return list;
    }

}
