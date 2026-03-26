package com.fnp.nosqldatabase.util;

import com.fnp.nosqldatabase.constants.Node;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class NodeSerializer {

    public static void writeNode(Node node, DataOutputStream dos) throws IOException {
        dos.writeUTF(node.getId());

        Map<String, String> keyValuePairs = node.getEntry();
        dos.writeInt(keyValuePairs.size());

        for (Map.Entry<String, String> entry : keyValuePairs.entrySet()) {
            dos.writeUTF(entry.getKey());
            dos.writeUTF(entry.getValue());
        }
    }

    public static Node readNode(DataInputStream dis) throws IOException {
        String id = dis.readUTF();

        int size = dis.readInt();

        Map<String, String> keyValuePairs = new HashMap<>();

        for (int i = 0; i < size; i++) {
            String key = dis.readUTF();
            String value = dis.readUTF();
            keyValuePairs.put(key, value);
        }

        Node node = new Node(keyValuePairs);
        node.setId(id);

        return node;
    }
}
