package static

import (
	"embed"
	"io/fs"
)

//go:embed all:dist
var distFS embed.FS

// GetFS returns the embedded filesystem containing the frontend static files
func GetFS() (fs.FS, error) {
	return fs.Sub(distFS, "dist")
}
