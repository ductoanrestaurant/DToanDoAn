# Stage 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies first to leverage Docker cache
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Build the application, skipping tests for faster Docker builds
RUN mvn clean install -DskipTests

# Stage 2: Create the final, lightweight image
FROM eclipse-temurin:17-jre

# Set the timezone for the application
ENV TZ="Asia/Ho_Chi_Minh"
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/admin-management-service.jar .

# Expose the port the application runs on (Spring Boot default)
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "admin-management-service.jar"]
