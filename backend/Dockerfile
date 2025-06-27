FROM golang:1.24.3-alpine

WORKDIR /app

# Install air with the new path!
RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./
RUN go mod download

COPY . .

CMD ["air"]
