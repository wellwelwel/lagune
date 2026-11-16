package com.example.session;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.util.Base64;

public final class CartCookie {
    private CartCookie() {}

    public static Cart read(String value) throws IOException, ClassNotFoundException {
        byte[] bytes = Base64.getDecoder().decode(value);

        try (ObjectInputStream input = new ObjectInputStream(new ByteArrayInputStream(bytes))) {
            return (Cart) input.readObject();
        }
    }
}
