package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetHolidayInfo(t *testing.T) {
	gin.SetMode(gin.TestMode)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	req := httptest.NewRequest(http.MethodGet, "/api/holiday", nil)
	c.Request = req

	GetHolidayInfo(c)

	assert.Equal(t, http.StatusOK, w.Code)

	var response HolidayResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.NotEmpty(t, response.Date)
}

func TestGetHolidayByDate(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name           string
		date           string
		expectedStatus int
		checkResponse  func(*testing.T, *httptest.ResponseRecorder)
	}{
		{
			name:           "Valid holiday date",
			date:           "2026-02-23",
			expectedStatus: http.StatusOK,
			checkResponse: func(t *testing.T, w *httptest.ResponseRecorder) {
				var response HolidayResponse
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Equal(t, "2026-02-23", response.Date)
				assert.True(t, response.IsHoliday)
				assert.False(t, response.IsWorkday)
				assert.Equal(t, "春节", response.Name)
			},
		},
		{
			name:           "Regular workday",
			date:           "2026-03-02",
			expectedStatus: http.StatusOK,
			checkResponse: func(t *testing.T, w *httptest.ResponseRecorder) {
				var response HolidayResponse
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Equal(t, "2026-03-02", response.Date)
				assert.False(t, response.IsHoliday)
				assert.True(t, response.IsWorkday)
			},
		},
		{
			name:           "Weekend",
			date:           "2026-02-28",
			expectedStatus: http.StatusOK,
			checkResponse: func(t *testing.T, w *httptest.ResponseRecorder) {
				var response HolidayResponse
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Equal(t, "2026-02-28", response.Date)
				assert.False(t, response.IsHoliday)
				assert.False(t, response.IsWorkday)
			},
		},
		{
			name:           "Invalid date format",
			date:           "invalid-date",
			expectedStatus: http.StatusBadRequest,
			checkResponse: func(t *testing.T, w *httptest.ResponseRecorder) {
				var response map[string]interface{}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Contains(t, response, "error")
			},
		},
		{
			name:           "Compensatory workday",
			date:           "2025-01-26",
			expectedStatus: http.StatusOK,
			checkResponse: func(t *testing.T, w *httptest.ResponseRecorder) {
				var response HolidayResponse
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Equal(t, "2025-01-26", response.Date)
				assert.False(t, response.IsHoliday)
				assert.True(t, response.IsWorkday)
				assert.Equal(t, "补班", response.Name)
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)

			req := httptest.NewRequest(http.MethodGet, "/api/holiday/"+tt.date, nil)
			c.Request = req
			c.Params = gin.Params{gin.Param{Key: "date", Value: tt.date}}

			GetHolidayByDate(c)

			assert.Equal(t, tt.expectedStatus, w.Code)
			tt.checkResponse(t, w)
		})
	}
}
