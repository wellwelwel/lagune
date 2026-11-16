package com.example.session;

import java.util.Set;

public final class LocaleCookie {
    private static final Set<String> SUPPORTED = Set.of("en", "pt", "es", "de");

    private LocaleCookie() {}

    public static String read(String value) {
        return SUPPORTED.contains(value) ? value : "en";
    }
}
