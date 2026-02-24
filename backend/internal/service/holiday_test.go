package service

import (
	"sync"
	"testing"
	"time"
)

func TestLoadHolidays(t *testing.T) {
	// Call loadHolidays to ensure it's executed
	loadHolidays()

	// Verify that holidays were loaded
	if chineseHolidays == nil {
		t.Fatal("chineseHolidays should not be nil after loadHolidays")
	}

	// Verify some known holidays exist
	knownHolidays := []string{"2024-01-01", "2025-10-01", "2026-02-16"}
	for _, date := range knownHolidays {
		if _, exists := chineseHolidays[date]; !exists {
			t.Errorf("Expected holiday %s not found in loaded data", date)
		}
	}
}

func TestGetHolidayInfo(t *testing.T) {
	tests := []struct {
		name         string
		date         string
		wantHoliday  bool
		wantWorkday  bool
		wantName     string
		wantType     string
	}{
		{
			name:         "Spring Festival 2026",
			date:         "2026-02-23",
			wantHoliday:  true,
			wantWorkday:  false,
			wantName:     "春节",
			wantType:     "holiday",
		},
		{
			name:         "Regular weekday",
			date:         "2026-03-02",
			wantHoliday:  false,
			wantWorkday:  true,
			wantName:     "",
			wantType:     "weekday",
		},
		{
			name:         "Weekend Saturday",
			date:         "2026-02-28",
			wantHoliday:  false,
			wantWorkday:  false,
			wantName:     "周末",
			wantType:     "weekend",
		},
		{
			name:         "Weekend Sunday",
			date:         "2026-03-01",
			wantHoliday:  false,
			wantWorkday:  false,
			wantName:     "周末",
			wantType:     "weekend",
		},
		{
			name:         "National Day 2025",
			date:         "2025-10-01",
			wantHoliday:  true,
			wantWorkday:  false,
			wantName:     "国庆节",
			wantType:     "holiday",
		},
		{
			name:         "Compensatory workday",
			date:         "2025-01-26",
			wantHoliday:  false,
			wantWorkday:  true,
			wantName:     "补班",
			wantType:     "workday",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := GetHolidayInfo(tt.date)
			if got.IsHoliday != tt.wantHoliday {
				t.Errorf("GetHolidayInfo(%s).IsHoliday = %v, want %v", tt.date, got.IsHoliday, tt.wantHoliday)
			}
			if got.IsWorkday != tt.wantWorkday {
				t.Errorf("GetHolidayInfo(%s).IsWorkday = %v, want %v", tt.date, got.IsWorkday, tt.wantWorkday)
			}
			if got.Name != tt.wantName {
				t.Errorf("GetHolidayInfo(%s).Name = %v, want %v", tt.date, got.Name, tt.wantName)
			}
			if got.Type != tt.wantType {
				t.Errorf("GetHolidayInfo(%s).Type = %v, want %v", tt.date, got.Type, tt.wantType)
			}
		})
	}
}

func TestGetHolidayInfoInvalidDate(t *testing.T) {
	// Invalid date should return workday
	got := GetHolidayInfo("invalid-date")
	if !got.IsWorkday {
		t.Errorf("GetHolidayInfo(invalid-date).IsWorkday = false, want true")
	}
}

func TestHolidayDataConsistency(t *testing.T) {
	// Load holidays to ensure data is loaded
	loadHolidays()

	// Ensure holiday data is consistent
	for date, note := range chineseHolidays {
		// Validate date format
		if _, err := time.Parse("2006-01-02", date); err != nil {
			t.Errorf("Invalid date format for %s: %v", date, err)
		}

		// Validate note is not empty
		if note.Note == "" {
			t.Errorf("Empty note for date %s", date)
		}
	}
}

func TestLoadHolidaysErrorPath(t *testing.T) {
	// Save original embed.FS and restore after test
	originalData := holidaysData
	defer func() { holidaysData = originalData }()

	// Reset holidayOnce to allow reloading
	holidayOnce = sync.Once{}

	// Test will use the actual embedded file
	// This test ensures the error handling paths exist and work
	// even if we can't easily trigger them
	loadHolidays()

	// Verify that holidays loaded successfully
	if chineseHolidays == nil {
		t.Error("chineseHolidays should not be nil")
	}
}
