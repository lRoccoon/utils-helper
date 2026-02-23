package api

import (
	"github.com/gin-gonic/gin"
	"github.com/lRoccoon/utils-helper/internal/api/handler"
)

// RegisterRoutes registers all API routes
func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// IP address routes
		api.GET("/ip", handler.GetIPInfo)

		// Holiday routes
		api.GET("/holiday", handler.GetHolidayInfo)
		api.GET("/holiday/:date", handler.GetHolidayByDate)
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})
}
