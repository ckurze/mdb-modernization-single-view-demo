# Mainframe Simulation Service for Oracle

## Overview
This Spring Boot application provides a RESTful service interface to simulate a mainframe. The current implementation relies on Oracle. 

## Build
The build is configured to run via Maven Wrapper (see https://github.com/takari/maven-wrapper for installation hints).

The service can be built using the following commands. It will create a Docker image called ckurze/mainframe-service (the prefix name can be changed in pom.xml, parameter ```docker.image.prefix```).
```
./mvnw clean install
./mvnw install dockerfile:build
```

If you want to push your own image into the docker registry, use the following command (you will receive an error message, if you do not change the ```docker.image.prefix``` parameter in ```pom.xml``` to your user name). Furhtermore, the authentication leverages maven authentication, therefore docker.io should be added to your maven settings.xml.
```
./mvnw dockerfile:push
```

Example maven settings.xml (Hint: Always use encrypted passwords as outlined here: https://blog.sonatype.com/2009/10/maven-tips-and-tricks-encrypting-passwords/):
```
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"      xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0                          https://maven.apache.org/xsd/settings-1.0.0.xsd">
  <localRepository/>
  <interactiveMode/>
  <usePluginRegistry/>
  <offline/>
  <pluginGroups/>
  <servers>
    <server>
      <id>docker.io</id>
      <username>mydockerhub_username</username>
      <password>{mydockerhub_password_encrypted}</password>
    </server>
  </servers>
  <mirrors/>
  <proxies/>
  <profiles/>
  <activeProfiles/>
</settings>
```

## Run the Service
After building the docker image, it can be run with:
```
docker run \
-p 8080:8080 \
-e TZ=CET \
-e spring.datasource.url=jdbc:oracle:thin:@YOUR_ORACLE_HOSTNAME_HERE:1521:XE \
-e spring.datasource.username=YOUR_USERNAME_HERE \
-e spring.datasource.password=YOUR_PASSWORD_HERE \
-t ckurze/mainframe-service
```

It includes environment parameter to configure the timezone (TZ, needed for the Oracle connection to work as it automatically injects the timezone from the environment).

 