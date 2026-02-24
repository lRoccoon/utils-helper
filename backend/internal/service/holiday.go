package service

import (
	"embed"
	"encoding/json"
	"log"
	"sync"
	"time"
)

//go:embed holidays.json
var holidaysData embed.FS

// HolidayInfo represents holiday information
type HolidayInfo struct {
	IsHoliday bool
	IsWorkday bool
	Name      string
	Type      string // "holiday", "workday", or "weekend"
}

// HolidayNote represents the JSON structure of holiday data
type HolidayNote struct {
	Note string `json:"note"`
}

var (
	chineseHolidays map[string]HolidayNote
	holidayOnce     sync.Once
)

// loadHolidays loads holiday data from embedded JSON file
func loadHolidays() {
	holidayOnce.Do(func() {
		data, err := holidaysData.ReadFile("holidays.json")
		if err != nil {
			log.Printf("Warning: Failed to load holidays data: %v", err)
			chineseHolidays = make(map[string]HolidayNote)
			return
		}

		if err := json.Unmarshal(data, &chineseHolidays); err != nil {
			log.Printf("Warning: Failed to parse holidays data: %v", err)
			chineseHolidays = make(map[string]HolidayNote)
			return
		}
	})
}

// GetHolidayInfo returns holiday information for a given date
func GetHolidayInfo(date string) HolidayInfo {
	loadHolidays()

	// Check if date is in holidays map
	if note, exists := chineseHolidays[date]; exists {
		// Check if it's a compensatory workday (补班)
		if note.Note == "补班" {
			return HolidayInfo{
				IsHoliday: false,
				IsWorkday: true,
				Name:      note.Note,
				Type:      "workday",
			}
		}
		// It's a holiday
		return HolidayInfo{
			IsHoliday: true,
			IsWorkday: false,
			Name:      note.Note,
			Type:      "holiday",
		}
	}

	// Parse date to check if it's a weekend
	t, err := time.Parse("2006-01-02", date)
	if err != nil {
		return HolidayInfo{IsHoliday: false, IsWorkday: true, Type: "weekday"}
	}

	weekday := t.Weekday()
	if weekday == time.Saturday || weekday == time.Sunday {
		return HolidayInfo{
			IsHoliday: false,
			IsWorkday: false,
			Name:      "周末",
			Type:      "weekend",
		}
	}

	// Regular workday
	return HolidayInfo{
		IsHoliday: false,
		IsWorkday: true,
		Type:      "weekday",
	}
}
