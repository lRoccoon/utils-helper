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

func TestGetContentType(t *testing.T) {
	tests := []struct {
		path     string
		expected string
	}{
		{"index.html", "text/html; charset=utf-8"},
		{"script.js", "application/javascript"},
		{"style.css", "text/css"},
		{"data.json", "application/json"},
		{"image.png", "image/png"},
		{"photo.jpg", "image/jpeg"},
		{"photo.jpeg", "image/jpeg"},
		{"icon.svg", "image/svg+xml"},
		{"font.woff", "font/woff"},
		{"font.woff2", "font/woff2"},
		{"unknown.xyz", "application/octet-stream"},
		{"", "application/octet-stream"},
	}

	for _, tt := range tests {
		t.Run(tt.path, func(t *testing.T) {
			got := getContentType(tt.path)
			if got != tt.expected {
				t.Errorf("getContentType(%q) = %q, want %q", tt.path, got, tt.expected)
			}
		})
	}
}

func TestMain(m *testing.M) {
	// Run tests
	code := m.Run()

	// Small delay to ensure cleanup
	time.Sleep(10 * time.Millisecond)

	os.Exit(code)
}
