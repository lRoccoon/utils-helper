package main

import (
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestSetupRouter(t *testing.T) {
	r := setupRouter()
	if r == nil {
		t.Fatal("setupRouter returned nil")
	}
}

func TestCORSMiddleware(t *testing.T) {
	r := setupRouter()

	tests := []struct {
		name           string
		method         string
		path           string
		expectedStatus int
		checkHeaders   bool
	}{
		{
			name:           "OPTIONS request",
			method:         "OPTIONS",
			path:           "/api/ip",
			expectedStatus: 204,
			checkHeaders:   true,
		},
		{
			name:           "GET request with CORS",
			method:         "GET",
			path:           "/api/ip",
			expectedStatus: 200,
			checkHeaders:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(tt.method, tt.path, nil)
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}

			if tt.checkHeaders {
				if w.Header().Get("Access-Control-Allow-Origin") != "*" {
					t.Error("CORS header not set correctly")
				}
			}
		})
	}
}

func TestStaticFileServing(t *testing.T) {
	r := setupRouter()

	tests := []struct {
		name           string
		path           string
		expectedStatus int
		checkContent   bool
	}{
		{
			name:           "Root path",
			path:           "/",
			expectedStatus: 404, // 404 if no static files embedded during test
			checkContent:   false,
		},
		{
			name:           "Explicit index.html",
			path:           "/index.html",
			expectedStatus: 404,
			checkContent:   false,
		},
		{
			name:           "Non-existent file",
			path:           "/some-spa-route",
			expectedStatus: 404,
			checkContent:   false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", tt.path, nil)
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}
		})
	}
}

func TestAPIRoutes(t *testing.T) {
	r := setupRouter()

	tests := []struct {
		name           string
		path           string
		expectedStatus int
	}{
		{
			name:           "IP endpoint",
			path:           "/api/ip",
			expectedStatus: 200,
		},
		{
			name:           "Holiday endpoint",
			path:           "/api/holiday?date=2024-01-01",
			expectedStatus: 200,
		},
		{
			name:           "Non-existent API endpoint",
			path:           "/api/nonexistent",
			expectedStatus: 404,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", tt.path, nil)
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}
		})
	}
}

