FROM golang:1.21.0

WORKDIR /usr/src/app

COPY . .

RUN go mod tidy
RUN go build -o /usr/src/app/main /usr/src/app/cmd/bench/main.go

CMD ["/usr/src/app/main"]
