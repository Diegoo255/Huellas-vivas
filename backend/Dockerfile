# Usamos una imagen base que ya tiene Java y Maven preinstalados
FROM maven:3.8.6-openjdk-17 AS build

# Establecemos el directorio de trabajo dentro del contenedor Docker
WORKDIR /app

# Copiamos el pom.xml y descargamos dependencias para acelerar futuras compilaciones
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código fuente de la aplicación
COPY src ./src

# Compilamos la aplicación Spring Boot. El resultado es el archivo JAR.
RUN mvn package -DskipTests

# --- FASE 2: Creación de la imagen final más ligera (Menos peso y más seguridad) ---
# Usamos una imagen solo con la JRE (runtime de Java)
FROM openjdk:17-jre-slim

# Creamos un directorio para la aplicación
WORKDIR /app

# Copiamos el JAR compilado desde la fase 'build' a la imagen final
COPY --from=build /app/target/*.jar app.jar

# Cambiamos el puerto para evitar conflictos en Render
EXPOSE 8081

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]