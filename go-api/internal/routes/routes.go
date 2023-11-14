package routes

import (
	"example/benchmark/internal/handlers"

	"github.com/gin-gonic/gin"
)

func AddBenchmarkRoutes(rg *gin.RouterGroup) {
	bm := rg.Group("/benchmark")
	bm.GET("/", handlers.GetEcho)
	bm.POST("/", handlers.PostEcho)
	bm.GET("/drivers", handlers.GetDrivers)
}

func InitRoutes(r *gin.Engine) {
	v1 := r.Group("/v1")
	AddBenchmarkRoutes(v1)
}
