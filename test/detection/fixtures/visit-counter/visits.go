package main

var visits = map[string]int{}

func record(path string) {
	visits[path]++
}

func snapshot() map[string]int {
	copied := make(map[string]int, len(visits))
	for path, count := range visits {
		copied[path] = count
	}
	return copied
}
