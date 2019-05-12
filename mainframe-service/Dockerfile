FROM openjdk:8
WORKDIR /usr/mainframe-service
COPY ./target/mainframe-service-0.0.1.jar /usr/mainframe-service/
EXPOSE 8080
CMD ["java", "-jar", "mainframe-service-0.0.1.jar"]