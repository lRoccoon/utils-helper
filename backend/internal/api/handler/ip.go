package handler

import (
	"net"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/lRoccoon/utils-helper/internal/service"
)

// IPInfoResponse represents the IP information response
type IPInfoResponse struct {
	IP          string  `json:"ip"`
	Version     string  `json:"version"`
	Country     string  `json:"country,omitempty"`
	CountryCode string  `json:"country_code,omitempty"`
	Region      string  `json:"region,omitempty"`
	City        string  `json:"city,omitempty"`
	Latitude    float64 `json:"latitude,omitempty"`
	Longitude   float64 `json:"longitude,omitempty"`
}

// GetIPInfo handles GET /api/ip requests
func GetIPInfo(c *gin.Context) {
	ip := getRealIP(c)

	// Determine IP version
	version := "unknown"
	if parsedIP := net.ParseIP(ip); parsedIP != nil {
		if parsedIP.To4() != nil {
			version = "IPv4"
		} else {
			version = "IPv6"
		}
	}

	response := IPInfoResponse{
		IP:      ip,
		Version: version,
	}

	// Try to get geolocation info
	if geoInfo, err := service.GetGeoLocation(ip); err == nil {
		response.Country = geoInfo.Country
		response.CountryCode = geoInfo.CountryCode
		response.Region = geoInfo.Region
		response.City = geoInfo.City
		response.Latitude = geoInfo.Latitude
		response.Longitude = geoInfo.Longitude
	}

	c.JSON(http.StatusOK, response)
}

// getRealIP extracts the real client IP from request
func getRealIP(c *gin.Context) string {
	// Try X-Forwarded-For header first
	if xff := c.GetHeader("X-Forwarded-For"); xff != "" {
		ips := strings.Split(xff, ",")
		if len(ips) > 0 {
			return strings.TrimSpace(ips[0])
		}
	}

	// Try X-Real-IP header
	if xri := c.GetHeader("X-Real-IP"); xri != "" {
		return xri
	}

	// Fall back to RemoteAddr
	ip := c.ClientIP()
	return ip
}
