package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func main() {
	uptime := newUptime()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		record(r.URL.Path)
		w.WriteHeader(http.StatusNoContent)
	})

	http.HandleFunc("/stats", func(w http.ResponseWriter, r *http.Request) {
		uptime.tick()
		json.NewEncoder(w).Encode(map[string]any{"checks": uptime.count(), "visits": snapshot()})
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
