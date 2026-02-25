package static

import (
	"testing"
)

func TestGetFS(t *testing.T) {
	fs, err := GetFS()
	if err != nil {
		t.Fatalf("GetFS() returned error: %v", err)
	}

	if fs == nil {
		t.Fatal("GetFS() returned nil filesystem")
	}

	// Try to read a file that should exist after build
	// We can't test for specific files since they're embedded at build time
	// but we can verify the function doesn't panic
}
