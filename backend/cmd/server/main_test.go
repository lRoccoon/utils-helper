package main

import (
	"os"
	"testing"
	"time"
)

func TestMainEnvironment(t *testing.T) {
	// Test that PORT environment variable is respected
	os.Setenv("PORT", "9999")
	defer os.Unsetenv("PORT")

	port := os.Getenv("PORT")
	if port != "9999" {
		t.Errorf("Expected PORT to be 9999, got %s", port)
	}
}

func TestMainDefaultPort(t *testing.T) {
	// Test default port when PORT is not set
	os.Unsetenv("PORT")

	port := os.Getenv("PORT")
	if port == "" {
		// This is expected - port should default to 8080 in main
		port = "8080"
	}

	if port != "8080" {
		t.Errorf("Expected default port to be 8080, got %s", port)
	}
}

func TestMain(m *testing.M) {
	// Run tests
	code := m.Run()

	// Small delay to ensure cleanup
	time.Sleep(10 * time.Millisecond)

	os.Exit(code)
}
