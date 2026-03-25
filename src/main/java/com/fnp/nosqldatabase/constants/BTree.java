package com.fnp.nosqldatabase.constants;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class BTree implements Serializable {
    private static final long serialVersionUID = 1L;
    private BTreeNode root;
    private final int minimumDegree;

    static class BTreeNode implements Serializable {
        String[] keys;
        Node[] values;
        BTreeNode[] children;
        int keyCount;
        boolean isLeaf;

        BTreeNode(int minimumDegree, boolean isLeaf) {
            this.keys = new String[2 * minimumDegree - 1];
            this.values = new Node[2 * minimumDegree - 1];
            this.children = new BTreeNode[2 * minimumDegree];
            this.isLeaf = isLeaf;
            this.keyCount = 0;
        }
    }

    public BTree(int minimumDegree) {
        this.minimumDegree = minimumDegree;
        this.root = new BTreeNode(minimumDegree, true);
    }

    public void insert(Node node) {
        String username = node.getEntry().get("username");
        if (username == null) throw new IllegalArgumentException("Node must have a 'username' field");

        BTreeNode currentRoot = root;

        if (currentRoot.keyCount == 2 * minimumDegree - 1) {
            BTreeNode newRoot = new BTreeNode(minimumDegree, false);
            root = newRoot;
            newRoot.children[0] = currentRoot;
            splitChild(newRoot, 0, currentRoot);
            insertNonFull(newRoot, username, node);
        } 
        
        else {
            insertNonFull(currentRoot, username, node);
        }
    }

    public List<Node> search(String key) {
        List<Node> results = new ArrayList<>();
        search(root, key, results);

        return results;
    }

    private void search(BTreeNode x, String key, List<Node> results) {
        if (x == null) return;

        int i = 0;
        while (i < x.keyCount && key.compareTo(x.keys[i]) > 0) {
            i++;
        }

        while (i < x.keyCount && key.equals(x.keys[i])) {
            results.add(x.values[i]);

            if (!x.isLeaf) {
                search(x.children[i], key, results);
            }
            i++;
        }

        if (!x.isLeaf) {
            search(x.children[i], key, results);
        }
    }

    private void insertNonFull(BTreeNode currentNode, String username, Node node) {
        int index = currentNode.keyCount - 1;

        if (currentNode.isLeaf) {
            while (index >= 0 && username.compareTo(currentNode.keys[index]) < 0) {
                currentNode.keys[index + 1] = currentNode.keys[index];
                currentNode.values[index + 1] = currentNode.values[index];
                index--;
            }
            currentNode.keys[index + 1] = username;
            currentNode.values[index + 1] = node;
            currentNode.keyCount++;
        }

        else {
            while (index >= 0 && username.compareTo(currentNode.keys[index]) < 0) {
                index--;
            }
            index++;
            BTreeNode targetChild = currentNode.children[index];
            if (targetChild.keyCount == 2 * minimumDegree - 1) {
                splitChild(currentNode, index, targetChild);
                if (username.compareTo(currentNode.keys[index]) > 0) index++;
            }
            insertNonFull(currentNode.children[index], username, node);
        }
    }

    private void splitChild(BTreeNode parentNode, int splitIndex, BTreeNode fullChild) {
        BTreeNode newChild = new BTreeNode(minimumDegree, fullChild.isLeaf);
        newChild.keyCount = minimumDegree - 1;

        for (int j = 0; j < minimumDegree - 1; j++) {
            newChild.keys[j] = fullChild.keys[j + minimumDegree];
            newChild.values[j] = fullChild.values[j + minimumDegree];
        }

        if (!fullChild.isLeaf) {
            for (int j = 0; j < minimumDegree; j++) {
                newChild.children[j] = fullChild.children[j + minimumDegree];
            }
        }

        fullChild.keyCount = minimumDegree - 1;

        for (int j = parentNode.keyCount; j >= splitIndex + 1; j--) {
            parentNode.children[j + 1] = parentNode.children[j];
        }
        parentNode.children[splitIndex + 1] = newChild;

        for (int j = parentNode.keyCount - 1; j >= splitIndex; j--) {
            parentNode.keys[j + 1] = parentNode.keys[j];
            parentNode.values[j + 1] = parentNode.values[j];
        }

        parentNode.keys[splitIndex] = fullChild.keys[minimumDegree - 1];
        parentNode.values[splitIndex] = fullChild.values[minimumDegree - 1];
        parentNode.keyCount++;
    }

    public List<Node> toList() {
        List<Node> result = new ArrayList<>();
        collectAllNodes(root, result);
        return result;
    }

    private void collectAllNodes(BTreeNode currentNode, List<Node> result) {
        for (int i = 0; i < currentNode.keyCount; i++) {
            if (!currentNode.isLeaf) {
                collectAllNodes(currentNode.children[i], result);
            }
            result.add(currentNode.values[i]);
        }
        if (!currentNode.isLeaf) {
            collectAllNodes(currentNode.children[currentNode.keyCount], result);
        }
    }

    public int size() {
        return countNodes(root);
    }

    private int countNodes(BTreeNode currentNode) {
        int count = currentNode.keyCount;
        if (!currentNode.isLeaf) {
            for (int i = 0; i <= currentNode.keyCount; i++) {
                count += countNodes(currentNode.children[i]);
            }
        }
        return count;
    }
}