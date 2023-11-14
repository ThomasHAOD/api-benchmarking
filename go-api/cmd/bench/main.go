package main

import (
	"database/sql"
	"example/benchmark/internal/db"
	"example/benchmark/internal/routes"

	"github.com/gin-gonic/gin"
)

func ApiMiddleware(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("databaseConn", db)
		c.Next()
	}
}

func main() {
	router := gin.Default()
	db := db.DB{}
	db.Initialize("user", "password", "database")
	router.Use(ApiMiddleware(db.DB))
	routes.InitRoutes(router)
	router.Run(":3003")
}
