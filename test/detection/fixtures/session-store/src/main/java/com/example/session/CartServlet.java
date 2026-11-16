package com.example.session;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/cart")
public class CartServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Cart cart = new Cart();
        String locale = "en";

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("cart")) {
                    try {
                        cart = CartCookie.read(cookie.getValue());
                    } catch (ClassNotFoundException exception) {
                        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                        return;
                    }
                }

                if (cookie.getName().equals("locale")) locale = LocaleCookie.read(cookie.getValue());
            }
        }

        response.setContentType("application/json");
        response.getWriter().printf("{\"locale\":\"%s\",\"items\":%d}", locale, cart.items().size());
    }
}
