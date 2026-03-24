package com.fnp.nosqldatabase.constants;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
public class Node implements Serializable {

    private static final long serialVersionUID = 1L;
    private Long id;
    private Map<String, String> entry;

    public Node(Map<String, String> keyValuePairs) {

        this.id = UUID.randomUUID().getMostSignificantBits() & Long.MAX_VALUE;
        this.entry = keyValuePairs;
    }

    public String toString() {
        return "id:"+id+":"+entry.toString();
    }


}