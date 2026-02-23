package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/lRoccoon/utils-helper/internal/service"
)

// HolidayResponse represents the holiday information response
type HolidayResponse struct {
	Date      string `json:"date"`
	IsHoliday bool   `json:"is_holiday"`
	IsWorkday bool   `json:"is_workday"`
	Name      string `json:"name,omitempty"`
	Type      string `json:"type,omitempty"`
}

// GetHolidayInfo handles GET /api/holiday requests (for today)
func GetHolidayInfo(c *gin.Context) {
	today := time.Now().Format("2006-01-02")
	info := service.GetHolidayInfo(today)

	c.JSON(http.StatusOK, HolidayResponse{
		Date:      today,
		IsHoliday: info.IsHoliday,
		IsWorkday: info.IsWorkday,
		Name:      info.Name,
		Type:      info.Type,
	})
}

// GetHolidayByDate handles GET /api/holiday/:date requests
func GetHolidayByDate(c *gin.Context) {
	date := c.Param("date")

	// Validate date format
	if _, err := time.Parse("2006-01-02", date); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	info := service.GetHolidayInfo(date)

	c.JSON(http.StatusOK, HolidayResponse{
		Date:      date,
		IsHoliday: info.IsHoliday,
		IsWorkday: info.IsWorkday,
		Name:      info.Name,
		Type:      info.Type,
	})
}
