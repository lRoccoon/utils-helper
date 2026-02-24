package main

import (
	"io/fs"
	"log"
	"net/http"
	"os"
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
			path := strings.TrimPrefix(c.Request.URL.Path, "/")

			// Skip if it's an API route
			if strings.HasPrefix(c.Request.URL.Path, "/api/") {
				c.JSON(http.StatusNotFound, gin.H{"error": "API endpoint not found"})
				return
			}

			// Try to serve the exact file
			if path == "" {
				path = "index.html"
			}

			if _, err := fs.Stat(staticFS, path); err == nil {
				c.FileFromFS(path, http.FS(staticFS))
				return
			}

			// Try path + .html
			if _, err := fs.Stat(staticFS, path+".html"); err == nil {
				c.FileFromFS(path+".html", http.FS(staticFS))
				return
			}

			// Try path + /index.html
			if _, err := fs.Stat(staticFS, path+"/index.html"); err == nil {
				c.FileFromFS(path+"/index.html", http.FS(staticFS))
				return
			}

			// Fallback to root index.html for SPA routing
			c.FileFromFS("index.html", http.FS(staticFS))
		})
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
