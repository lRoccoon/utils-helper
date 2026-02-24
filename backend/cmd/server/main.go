package main

import (
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/lRoccoon/utils-helper/internal/api"
	"github.com/lRoccoon/utils-helper/internal/static"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Register API routes
	api.RegisterRoutes(r)

	// Serve static files from embedded frontend
	staticFS, err := static.GetFS()
	if err != nil {
		log.Printf("Warning: Failed to load embedded static files: %v", err)
	} else {
		// Serve static files with fallback to index.html for SPA routing
		r.NoRoute(func(c *gin.Context) {
			path := c.Request.URL.Path

			// Skip if it's an API route
			if strings.HasPrefix(path, "/api/") {
				c.JSON(http.StatusNotFound, gin.H{"error": "API endpoint not found"})
				return
			}

			// Try to serve the file
			if _, err := fs.Stat(staticFS, strings.TrimPrefix(path, "/")); err == nil {
				c.FileFromFS(path, http.FS(staticFS))
				return
			}

			// Try with .html extension
			htmlPath := strings.TrimPrefix(path, "/") + ".html"
			if _, err := fs.Stat(staticFS, htmlPath); err == nil {
				c.FileFromFS("/"+htmlPath, http.FS(staticFS))
				return
			}

			// Try as directory with index.html
			indexPath := filepath.Join(strings.TrimPrefix(path, "/"), "index.html")
			if _, err := fs.Stat(staticFS, indexPath); err == nil {
				c.FileFromFS("/"+indexPath, http.FS(staticFS))
				return
			}

			// Fallback to root index.html for SPA routing
			c.FileFromFS("/index.html", http.FS(staticFS))
		})
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
