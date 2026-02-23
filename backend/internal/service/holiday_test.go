package service

import (
	"testing"
	"time"
)

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
	// Ensure holiday data is consistent - holidays should not be workdays
	for date, info := range chineseHolidays {
		if info.IsHoliday && info.IsWorkday {
			t.Errorf("Date %s is marked as both holiday and workday", date)
		}

		// Validate date format
		if _, err := time.Parse("2006-01-02", date); err != nil {
			t.Errorf("Invalid date format for %s: %v", date, err)
		}
	}
}
