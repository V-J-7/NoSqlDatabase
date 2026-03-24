package com.fnp.nosqldatabase.service;


import com.fnp.nosqldatabase.constants.BTree;
import com.fnp.nosqldatabase.constants.Node;
import com.fnp.nosqldatabase.constants.NodeSerializer;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class FileServiceWithIndex {
    private static final int TREE_DEGREE = 4;
    private static final File file = new File("database_with_index.db");

    private BTree tree;

    @PostConstruct
    public void loadTree() throws IOException {
        if (tree != null) return;

        if (!file.exists() || file.length() == 0) {
            file.createNewFile();
            tree = new BTree(TREE_DEGREE);
            return;
        }

        DataInputStream dis = new DataInputStream(new BufferedInputStream(new FileInputStream(file)));
        tree = new BTree(TREE_DEGREE);
        int totalNodes = dis.readInt();

        for (int i = 0; i < totalNodes; i++) {
            Node readNode = NodeSerializer.readNode(dis);
            tree.insert(readNode);
        }
    }

    public List<Node> search(String username) {
        log.info("Number of records: {}", tree.size());
        return Collections.singletonList(tree.search(username));
    }

    public void addManyToFile(List<Map<String, String>> requestMap) throws IOException {
        for (Map<String, String> map : requestMap) {
            tree.insert(new Node(map));
        }

        flush();
    }

    public void flush() throws IOException {
        try (DataOutputStream dos = new DataOutputStream(new BufferedOutputStream(new FileOutputStream(file)))) {
            List<Node> list = tree.toList();

            dos.writeInt(list.size());

            for (Node node : list) {
                NodeSerializer.writeNode(node, dos);
            }
        }
    }

    public List<Node> getAll() {
        return tree.toList();
    }
}
