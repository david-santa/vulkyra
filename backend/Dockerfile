FROM golang:1.24.3-alpine as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o vulkyra-backend ./cmd/vulkyra-backend

FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/vulkyra-backend .
EXPOSE 8080
CMD ["./vulkyra-backend"]
