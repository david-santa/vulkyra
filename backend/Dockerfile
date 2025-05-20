FROM golang:1.24.3-alpine as builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o vulkyra-api main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/vulkyra-api .
EXPOSE 8080
CMD ["./vulkyra-api"]
