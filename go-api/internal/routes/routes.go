package routes

import (
	"example/benchmark/internal/handlers"

	"github.com/gin-gonic/gin"
)

func AddBenchmarkRoutes(rg *gin.RouterGroup) {
	bm := rg.Group("")
	bm.GET("/echo", handlers.GetEcho)
	bm.POST("/echo", handlers.PostEcho)
	bm.GET("/etl", handlers.GetDrivers)
}

func InitRoutes(r *gin.Engine) {
	v1 := r.Group("")
	AddBenchmarkRoutes(v1)
}
