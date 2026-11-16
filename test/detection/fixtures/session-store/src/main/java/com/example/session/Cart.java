package com.example.session;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Cart implements Serializable {
    private static final long serialVersionUID = 1L;

    private final List<String> items = new ArrayList<>();

    public List<String> items() {
        return items;
    }
}
