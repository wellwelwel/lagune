package main

import "sync"

type uptime struct {
	mu     sync.Mutex
	checks int
}

func newUptime() *uptime {
	return &uptime{}
}

func (u *uptime) tick() {
	u.mu.Lock()
	defer u.mu.Unlock()
	u.checks++
}

func (u *uptime) count() int {
	u.mu.Lock()
	defer u.mu.Unlock()
	return u.checks
}
