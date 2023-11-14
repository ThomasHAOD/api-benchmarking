package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Driver struct {
	Driver_id   int            `json:"driver_id"`
	Driver_ref  string         `json:"driver_ref"`
	Number      sql.NullInt64  `json:"number"`
	Code        sql.NullString `json:"code"`
	Forename    string         `json:"forename"`
	Surname     string         `json:"surname"`
	DOB         sql.NullTime   `json:"dob"`
	Nationality sql.NullString `json:"nationality"`
	URL         string         `json:"url"`
}

func GetEcho(c *gin.Context) {
	values := c.Request.URL.Query()
	c.JSON(http.StatusOK, values)
}

func PostEcho(c *gin.Context) {
	mapValues := make(map[string]string)
	if err := c.ShouldBindJSON(&mapValues); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusCreated, mapValues)
}

func GetDrivers(c *gin.Context) {
	db := c.MustGet("databaseConn").(*sql.DB)
	rows, _ := db.Query("SELECT * from drivers")
	defer rows.Close()
	drivers := []Driver{}

	for rows.Next() {
		var d Driver
		if err := rows.Scan(&d.Driver_id, &d.Driver_ref, &d.Number, &d.Code, &d.Forename, &d.Surname, &d.DOB, &d.Nationality, &d.URL); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
		}
		drivers = append(drivers, d)
	}
	c.JSON(http.StatusOK, drivers)
}
