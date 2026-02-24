package main

import (
	"fmt"
	"io/fs"
	"log"

	"github.com/lRoccoon/utils-helper/internal/static"
)

func main() {
	staticFS, err := static.GetFS()
	if err != nil {
		log.Fatalf("Failed to get static FS: %v", err)
	}

	fmt.Println("=== Files in embedded filesystem ===")
	err = fs.WalkDir(staticFS, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() {
			fmt.Printf("  - %s\n", path)
		}
		return nil
	})

	if err != nil {
		log.Fatalf("Error walking filesystem: %v", err)
	}

	fmt.Println("\n=== Checking for index.html ===")
	if _, err := fs.Stat(staticFS, "index.html"); err == nil {
		fmt.Println("  ✓ index.html found")
	} else {
		fmt.Printf("  ✗ index.html not found: %v\n", err)
	}
}
