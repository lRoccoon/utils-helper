package main

import (
	"io"
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
		// Handle all routes for SPA
		r.NoRoute(func(c *gin.Context) {
			path := c.Request.URL.Path

			// Skip if it's an API route
			if strings.HasPrefix(path, "/api/") {
				c.JSON(http.StatusNotFound, gin.H{"error": "API endpoint not found"})
				return
			}

			// Serve static files
			path = strings.TrimPrefix(path, "/")
			if path == "" {
				path = "index.html"
			}

			// Try to read the file from embedded FS
			data, err := staticFS.Open(path)
			if err == nil {
				defer data.Close()
				stat, _ := data.Stat()
				if !stat.IsDir() {
					content, _ := io.ReadAll(data)
					c.Data(http.StatusOK, getContentType(path), content)
					return
				}
			}

			// Try with .html extension
			data, err = staticFS.Open(path + ".html")
			if err == nil {
				defer data.Close()
				content, _ := io.ReadAll(data)
				c.Data(http.StatusOK, "text/html; charset=utf-8", content)
				return
			}

			// Try index.html in subdirectory
			data, err = staticFS.Open(path + "/index.html")
			if err == nil {
				defer data.Close()
				content, _ := io.ReadAll(data)
				c.Data(http.StatusOK, "text/html; charset=utf-8", content)
				return
			}

			// Fallback to root index.html for SPA routing
			data, err = staticFS.Open("index.html")
			if err == nil {
				defer data.Close()
				content, _ := io.ReadAll(data)
				c.Data(http.StatusOK, "text/html; charset=utf-8", content)
			} else {
				c.String(http.StatusNotFound, "404 page not found")
			}
		})
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func getContentType(path string) string {
	if strings.HasSuffix(path, ".html") {
		return "text/html; charset=utf-8"
	}
	if strings.HasSuffix(path, ".js") {
		return "application/javascript"
	}
	if strings.HasSuffix(path, ".css") {
		return "text/css"
	}
	if strings.HasSuffix(path, ".json") {
		return "application/json"
	}
	if strings.HasSuffix(path, ".png") {
		return "image/png"
	}
	if strings.HasSuffix(path, ".jpg") || strings.HasSuffix(path, ".jpeg") {
		return "image/jpeg"
	}
	if strings.HasSuffix(path, ".svg") {
		return "image/svg+xml"
	}
	if strings.HasSuffix(path, ".woff") {
		return "font/woff"
	}
	if strings.HasSuffix(path, ".woff2") {
		return "font/woff2"
	}
	return "application/octet-stream"
}
