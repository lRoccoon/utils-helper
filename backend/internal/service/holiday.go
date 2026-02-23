package service

import (
	"time"
)

// HolidayInfo represents holiday information
type HolidayInfo struct {
	IsHoliday bool
	IsWorkday bool
	Name      string
	Type      string // "holiday", "workday", or "weekend"
}

// Chinese holidays data for 2024-2026
// In production, this should be loaded from a database or API
var chineseHolidays = map[string]HolidayInfo{
	// 2024
	"2024-01-01": {IsHoliday: true, IsWorkday: false, Name: "元旦", Type: "holiday"},
	"2024-02-10": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2024-02-11": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2024-02-12": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2024-02-13": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2024-02-14": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2024-02-15": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2024-02-16": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2024-02-17": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2024-04-04": {IsHoliday: true, IsWorkday: false, Name: "清明节", Type: "holiday"},
	"2024-04-05": {IsHoliday: true, IsWorkday: false, Name: "清明节", Type: "holiday"},
	"2024-04-06": {IsHoliday: true, IsWorkday: false, Name: "清明节", Type: "holiday"},
	"2024-05-01": {IsHoliday: true, IsWorkday: false, Name: "劳动节", Type: "holiday"},
	"2024-05-02": {IsHoliday: true, IsWorkday: false, Name: "劳动节", Type: "holiday"},
	"2024-05-03": {IsHoliday: true, IsWorkday: false, Name: "劳动节", Type: "holiday"},
	"2024-05-04": {IsHoliday: true, IsWorkday: false, Name: "劳动节", Type: "holiday"},
	"2024-05-05": {IsHoliday: true, IsWorkday: false, Name: "劳动节", Type: "holiday"},
	"2024-06-10": {IsHoliday: true, IsWorkday: false, Name: "端午节", Type: "holiday"},
	"2024-09-15": {IsHoliday: true, IsWorkday: false, Name: "中秋节", Type: "holiday"},
	"2024-09-16": {IsHoliday: true, IsWorkday: false, Name: "中秋节", Type: "holiday"},
	"2024-09-17": {IsHoliday: true, IsWorkday: false, Name: "中秋节", Type: "holiday"},
	"2024-10-01": {IsHoliday: true, IsWorkday: false, Name: "国庆节", Type: "holiday"},
	"2024-10-02": {IsHoliday: true, IsWorkday: false, Name: "国庆节", Type: "holiday"},
	"2024-10-03": {IsHoliday: true, IsWorkday: false, Name: "国庆节", Type: "holiday"},
	"2024-10-04": {IsHoliday: true, IsWorkday: false, Name: "国庆节", Type: "holiday"},
	"2024-10-05": {IsHoliday: true, IsWorkday: false, Name: "国庆节", Type: "holiday"},
	"2024-10-06": {IsHoliday: true, IsWorkday: false, Name: "国庆节", Type: "holiday"},
	"2024-10-07": {IsHoliday: true, IsWorkday: false, Name: "国庆节", Type: "holiday"},
	// Compensatory workdays
	"2024-02-04": {IsHoliday: false, IsWorkday: true, Name: "补班", Type: "workday"},
	"2024-02-18": {IsHoliday: false, IsWorkday: true, Name: "补班", Type: "workday"},
	"2024-04-07": {IsHoliday: false, IsWorkday: true, Name: "补班", Type: "workday"},
	"2024-04-28": {IsHoliday: false, IsWorkday: true, Name: "补班", Type: "workday"},
	"2024-09-14": {IsHoliday: false, IsWorkday: true, Name: "补班", Type: "workday"},
	"2024-09-29": {IsHoliday: false, IsWorkday: true, Name: "补班", Type: "workday"},
	"2024-10-12": {IsHoliday: false, IsWorkday: true, Name: "补班", Type: "workday"},

	// 2025
	"2025-01-01": {IsHoliday: true, IsWorkday: false, Name: "元旦", Type: "holiday"},
	"2025-01-28": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2025-01-29": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2025-01-30": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2025-01-31": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2025-02-01": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2025-02-02": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2025-02-03": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2025-02-04": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2025-04-04": {IsHoliday: true, IsWorkday: false, Name: "清明节", Type: "holiday"},
	"2025-04-05": {IsHoliday: true, IsWorkday: false, Name: "清明节", Type: "holiday"},
	"2025-04-06": {IsHoliday: true, IsWorkday: false, Name: "清明节", Type: "holiday"},
	"2025-05-01": {IsHoliday: true, IsWorkday: false, Name: "劳动节", Type: "holiday"},
	"2025-05-02": {IsHoliday: true, IsWorkday: false, Name: "劳动节", Type: "holiday"},
	"2025-05-03": {IsHoliday: true, IsWorkday: false, Name: "劳动节", Type: "holiday"},
	"2025-05-31": {IsHoliday: true, IsWorkday: false, Name: "端午节", Type: "holiday"},
	"2025-06-01": {IsHoliday: true, IsWorkday: false, Name: "端午节", Type: "holiday"},
	"2025-06-02": {IsHoliday: true, IsWorkday: false, Name: "端午节", Type: "holiday"},
	"2025-10-01": {IsHoliday: true, IsWorkday: false, Name: "国庆节", Type: "holiday"},
	"2025-10-02": {IsHoliday: true, IsWorkday: false, Name: "国庆节", Type: "holiday"},
	"2025-10-03": {IsHoliday: true, IsWorkday: false, Name: "国庆节", Type: "holiday"},
	"2025-10-04": {IsHoliday: true, IsWorkday: false, Name: "国庆节", Type: "holiday"},
	"2025-10-05": {IsHoliday: true, IsWorkday: false, Name: "国庆节", Type: "holiday"},
	"2025-10-06": {IsHoliday: true, IsWorkday: false, Name: "中秋节", Type: "holiday"},
	"2025-10-07": {IsHoliday: true, IsWorkday: false, Name: "中秋节", Type: "holiday"},
	"2025-10-08": {IsHoliday: true, IsWorkday: false, Name: "中秋节", Type: "holiday"},
	// Compensatory workdays
	"2025-01-26": {IsHoliday: false, IsWorkday: true, Name: "补班", Type: "workday"},
	"2025-02-08": {IsHoliday: false, IsWorkday: true, Name: "补班", Type: "workday"},
	"2025-09-28": {IsHoliday: false, IsWorkday: true, Name: "补班", Type: "workday"},
	"2025-10-11": {IsHoliday: false, IsWorkday: true, Name: "补班", Type: "workday"},

	// 2026
	"2026-01-01": {IsHoliday: true, IsWorkday: false, Name: "元旦", Type: "holiday"},
	"2026-01-02": {IsHoliday: true, IsWorkday: false, Name: "元旦", Type: "holiday"},
	"2026-01-03": {IsHoliday: true, IsWorkday: false, Name: "元旦", Type: "holiday"},
	"2026-02-16": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2026-02-17": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2026-02-18": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2026-02-19": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2026-02-20": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2026-02-21": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2026-02-22": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
	"2026-02-23": {IsHoliday: true, IsWorkday: false, Name: "春节", Type: "holiday"},
}

// GetHolidayInfo returns holiday information for a given date
func GetHolidayInfo(date string) HolidayInfo {
	// Check if date is in holidays map
	if info, exists := chineseHolidays[date]; exists {
		return info
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
