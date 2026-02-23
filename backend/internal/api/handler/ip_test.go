package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetIPInfo(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name          string
		headers       map[string]string
		expectedIP    string
		checkResponse func(*testing.T, *httptest.ResponseRecorder)
	}{
		{
			name: "Basic IP detection",
			headers: map[string]string{
				"X-Forwarded-For": "203.0.113.1",
			},
			expectedIP: "203.0.113.1",
			checkResponse: func(t *testing.T, w *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusOK, w.Code)

				var response IPInfoResponse
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Equal(t, "203.0.113.1", response.IP)
				assert.Equal(t, "IPv4", response.Version)
			},
		},
		{
			name: "X-Real-IP header",
			headers: map[string]string{
				"X-Real-IP": "198.51.100.1",
			},
			expectedIP: "198.51.100.1",
			checkResponse: func(t *testing.T, w *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusOK, w.Code)

				var response IPInfoResponse
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Contains(t, response.IP, "198.51.100.1")
				assert.Equal(t, "IPv4", response.Version)
			},
		},
		{
			name: "IPv6 address",
			headers: map[string]string{
				"X-Forwarded-For": "2001:db8::1",
			},
			expectedIP: "2001:db8::1",
			checkResponse: func(t *testing.T, w *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusOK, w.Code)

				var response IPInfoResponse
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Equal(t, "2001:db8::1", response.IP)
				assert.Equal(t, "IPv6", response.Version)
			},
		},
		{
			name: "Localhost IP",
			headers: map[string]string{
				"X-Forwarded-For": "127.0.0.1",
			},
			expectedIP: "127.0.0.1",
			checkResponse: func(t *testing.T, w *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusOK, w.Code)

				var response IPInfoResponse
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Equal(t, "127.0.0.1", response.IP)
				assert.Equal(t, "IPv4", response.Version)
				assert.Equal(t, "Local", response.Country)
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)

			// Set up request
			req := httptest.NewRequest(http.MethodGet, "/api/ip", nil)
			for k, v := range tt.headers {
				req.Header.Set(k, v)
			}
			c.Request = req

			// Call handler
			GetIPInfo(c)

			// Check response
			tt.checkResponse(t, w)
		})
	}
}

func TestGetRealIP(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name       string
		headers    map[string]string
		remoteAddr string
		expectedIP string
	}{
		{
			name: "X-Forwarded-For with single IP",
			headers: map[string]string{
				"X-Forwarded-For": "203.0.113.1",
			},
			expectedIP: "203.0.113.1",
		},
		{
			name: "X-Forwarded-For with multiple IPs",
			headers: map[string]string{
				"X-Forwarded-For": "203.0.113.1, 198.51.100.1",
			},
			expectedIP: "203.0.113.1",
		},
		{
			name: "X-Real-IP",
			headers: map[string]string{
				"X-Real-IP": "198.51.100.1",
			},
			expectedIP: "198.51.100.1",
		},
		{
			name:       "Fallback to ClientIP",
			headers:    map[string]string{},
			expectedIP: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)

			req := httptest.NewRequest(http.MethodGet, "/", nil)
			for k, v := range tt.headers {
				req.Header.Set(k, v)
			}
			c.Request = req

			result := getRealIP(c)
			if tt.expectedIP != "" {
				assert.Contains(t, result, tt.expectedIP)
			} else {
				// For fallback case, just check that we get some IP
				assert.NotEmpty(t, result)
			}
		})
	}
}
