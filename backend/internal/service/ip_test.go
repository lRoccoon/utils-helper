package service

import (
	"testing"
)

func TestGetGeoLocation(t *testing.T) {
	tests := []struct {
		name    string
		ip      string
		wantErr bool
	}{
		{
			name:    "Valid IPv4",
			ip:      "8.8.8.8",
			wantErr: false,
		},
		{
			name:    "Valid IPv6",
			ip:      "2001:4860:4860::8888",
			wantErr: false,
		},
		{
			name:    "Localhost IPv4",
			ip:      "127.0.0.1",
			wantErr: false,
		},
		{
			name:    "Localhost IPv6",
			ip:      "::1",
			wantErr: false,
		},
		{
			name:    "Private IPv4",
			ip:      "192.168.1.1",
			wantErr: false,
		},
		{
			name:    "Invalid IP",
			ip:      "invalid",
			wantErr: false, // Returns nil without error
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetGeoLocation(tt.ip)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetGeoLocation() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			// For localhost/private IPs, should return "Local"
			if tt.ip == "127.0.0.1" || tt.ip == "::1" || tt.ip == "192.168.1.1" {
				if got != nil && got.Country != "Local" {
					t.Errorf("GetGeoLocation(%s).Country = %v, want Local", tt.ip, got.Country)
				}
			}
		})
	}
}

func TestGetGeoLocationNil(t *testing.T) {
	// Test with invalid IP
	got, err := GetGeoLocation("not-an-ip")
	if err != nil {
		t.Errorf("GetGeoLocation() should not return error for invalid IP, got: %v", err)
	}
	if got != nil {
		t.Errorf("GetGeoLocation() should return nil for invalid IP, got: %v", got)
	}
}
