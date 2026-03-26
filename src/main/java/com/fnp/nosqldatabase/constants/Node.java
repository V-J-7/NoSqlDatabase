package com.fnp.nosqldatabase.constants;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;
import java.util.UUID;

@Getter
@Setter
public class Node {
    private String id;
    private Map<String, String> entry;

    public Node(Map<String, String> keyValuePairs) {

        this.id = String.valueOf(UUID.randomUUID());
        this.entry = keyValuePairs;
    }

    public String toString() {
        return "id:"+id+":"+entry.toString();
    }


}