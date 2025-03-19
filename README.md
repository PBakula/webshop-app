# Webshop Project

Webshop aplikacija s funkcionalnošću pregleda proizvoda, kupovine i administracije, koja koristi Java Spring Boot backend i React TypeScript frontend.

<img width="1437" alt="homepage2" src="https://github.com/user-attachments/assets/9afe7895-170d-4068-852e-88fb41a905b0" />

<img width="1440" alt="paymentResultPage" src="https://github.com/user-attachments/assets/2d68d94a-bab6-4858-8004-fd5d774f900a" />

![adminProducts](https://github.com/user-attachments/assets/25227672-a26c-48c0-b437-e58a69cf269a)


## Opis projekta

Webshop projekt je implementacija online trgovine koja omogućuje korisnicima pregled proizvoda po kategorijama, dodavanje proizvoda u košaricu, te kupovinu putem više načina plaćanja (PayPal ili plaćanje pouzećem). Aplikacija ima i administratorsko sučelje za upravljanje proizvodima i kategorijama, te praćenje povijesti narudžbi i korisničkih aktivnosti.

Backend aplikacija je izrađena koristeći Spring Boot framework i nosi naziv `javawebproject`, dok je frontend implementiran kao React aplikacija s TypeScript-om pod nazivom `webshop-react-app`.

## Vizualni prikaz aplikacije

Screenshotovi aplikacije dostupni su u repozitoriju u mapi `/screenshots`. Ovi screenshotovi prikazuju različite dijelove aplikacije i funkcionalnosti.

## Funkcionalnosti

### Općenito
- Pregled kataloga proizvoda
- Filtriranje proizvoda po kategorijama
- Sortiranje proizvoda po cijeni
- Košarica za kupovinu (lokalno spremanje)

### Korisnici (neregistrirani)
- Pregledavanje proizvoda
- Dodavanje proizvoda u košaricu

### Korisnici (registrirani)
- Prijava i registracija
- Kupovina proizvoda
- Odabir načina plaćanja (PayPal ili pouzećem)
- Pregled povijesti narudžbi

### Administrator
- CRUD operacije nad proizvodima
- CRUD operacije nad kategorijama
- Pregled svih narudžbi
- Pregled povijesti prijava korisnika
- Pristup logu HTTP zahtjeva

## Tehnologije

### Backend
- Java 17
- Spring Boot 3.4.1
- Spring Security 6 za autentikaciju i autorizaciju
- JWT (JJWT 0.11.5) za token-baziranu autentikaciju
- Spring Data JPA i Hibernate za ORM
- MySQL baza podataka (MySQL Connector 8.0.33) - projekt je konfiguriran za MySQL, ali može se prilagoditi za druge SQL baze
- Lombok za smanjenje boilerplate koda
- Model Mapper (3.1.0) za mapiranje entiteta u DTO objekte
- Hibernate Validator (8.0.1) za validaciju ulaznih podataka
- PayPal REST API SDK (1.14.0) za procesiranje plaćanja
- Filteri i Listeneri za obradu zahtjeva i praćenje aktivnosti

### Frontend
- React s TypeScript
- Bootstrap za UI
- Axios za HTTP zahtjeve
- React Router za navigaciju
- Local Storage za spremanje košarice
- JWT za autentikaciju
- React Context API za globalno stanje


## API Dokumentacija

Swagger dokumentacija je dostupna kao dio repozitorija. Swagger file je uključen u repozitorij i mora se ručno pokrenuti za pregled API endpointa i njihove funkcionalnosti.

## API Endpointi

### Autentikacija
- POST `/api/login` - Prijava korisnika
- POST `/api/register` - Registracija korisnika
- POST `/api/refreshToken` - Obnova JWT tokena
- POST `/api/logout` - Odjava korisnika

### Proizvodi
- GET `/api/products` - Dohvat svih proizvoda
- GET `/api/products/{id}` - Dohvat proizvoda po ID-u
- POST `/api/products` - Kreiranje novog proizvoda
- PUT `/api/products/{id}` - Ažuriranje proizvoda
- DELETE `/api/products/{id}` - Brisanje proizvoda

### Kategorije
- GET `/api/categories` - Dohvat svih kategorija
- GET `/api/categories/{id}` - Dohvat kategorije po ID-u
- POST `/api/categories` - Kreiranje nove kategorije
- PUT `/api/categories/{id}` - Ažuriranje kategorije
- DELETE `/api/categories/{id}` - Brisanje kategorije

### Košarica
- POST `/api/cart/checkout` - Obrada narudžbe

### Plaćanje
- GET `/api/payment/success` - Obrada uspješnog PayPal plaćanja
- GET `/api/payment/cancel` - Obrada otkazanog PayPal plaćanja
- GET `/api/payment/status/{orderId}` - Provjera statusa narudžbe
- GET `/api/payment/error` - Obrada greške u plaćanju

### Narudžbe
- GET `/api/orders` - Dohvat narudžbi trenutnog korisnika

### Administracija
- GET `/api/history-log` - Dohvat povijesti prijava korisnika
- GET `/api/request-log` - Dohvat loga HTTP zahtjeva


## Preduvjeti

Za lokalno pokretanje ovog projekta, potrebno je instalirati sljedeće:

### Backend preduvjeti:
- Java JDK 17
- Maven
- MySQL (verzija 8.0 ili novija)

### Frontend preduvjeti:
- Node.js (18.x ili noviji)
- npm (9.x ili noviji)

## Postavljanje projekta

### 1. Postavljanje baze podataka

```sql
CREATE DATABASE webshop_db;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'Lozinka1$';
GRANT ALL PRIVILEGES ON webshop_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

**Napomena:** Ako već imate MySQL korisnika s drugim korisničkim imenom/lozinkom, možete koristiti postojećeg korisnika - samo trebate ažurirati postavke u `application-local.properties` datoteci u backend projektu.

### 2. Postavljanje backend projekta

1. Klonirajte repozitorij:
```bash
git clone [URL_VAŠEG_REPOZITORIJA]
cd [NAZIV_VAŠEG_REPOZITORIJA]/backend
```

2. Kompajlirajte i pokrenite Spring Boot aplikaciju:
```bash
mvn clean install
mvn spring-boot:run
```

Spring Boot aplikacija će biti dostupna na `http://localhost:9090`.

#### Konfiguracija backend aplikacije

Aplikacija koristi dvije properties datoteke koje morate stvoriti jer nisu uključene u repozitorij:

1. Stvorite datoteku `application.properties` u `src/main/resources/` direktoriju sa sljedećim sadržajem:

```properties
spring.profiles.active=local
spring.application.name=javaWebProject
server.port=9090

# Database configurations
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.generate-ddl=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.jdbc.time_zone=UTC
spring.datasource.hikari.connection-init-sql=SET time_zone = '+00:00';

# File upload settings
spring.servlet.multipart.max-file-size=2MB
spring.servlet.multipart.max-request-size=2MB

# Image storage configuration
app.image.upload-dir=src/main/resources/static/images/uploads
app.image.public-url=/images/uploads
app.image.default-image=/images/image-not-found.png

# Ostale konfiguracije možete dodati prema potrebi
```

2. Stvorite datoteku `application-local.properties` u `src/main/resources/` direktoriju sa sljedećim sadržajem:

```properties
# Database connection for local development
spring.datasource.url=jdbc:mysql://localhost:3306/webshop_db
spring.datasource.username=root
spring.datasource.password=Lozinka1$
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JWT configuration
jwt.secret=357638792F423F4428472B4B6250655368566D597133743677397A2443264629

# PayPal configuration
paypal.client-id=AWySiD-qVMFmstR7I5trfwJXy5gbeHWggQlZUgJ7baxmHvybDl4uxV0e0Lt0plJ9hlPSvAIri-8-r2zz
paypal.client-secret=EM-h82Vy-2jE2CEkkB1fOqA4uV1fmZN1v6ITnX4yxZMvfY892JdS50-VkMKt-k-aAQ5mw9NPZTxj7TPT
paypal.mode=sandbox
```

**Napomena:** Ako već imate MySQL korisnika s drugim korisničkim imenom/lozinkom, ažurirajte postavke `spring.datasource.username` i `spring.datasource.password` u `application-local.properties` datoteci.

### 3. Postavljanje frontend projekta

1. Navigirajte do frontend direktorija:
```bash
cd [NAZIV_VAŠEG_REPOZITORIJA]/frontend
```

2. Instalirajte dependencije:
```bash
npm install
```

3. Pokrenite React aplikaciju:
```bash
npm run dev
```

Frontend aplikacija će biti dostupna na `http://localhost:5173` (ili neki drugi port kojeg Vite odabere ako je 5173 zauzet).

## API Dokumentacija

Projekt koristi ručno napisanu Swagger dokumentaciju. Za pregled API dokumentacije:

1. Otvorite Swagger datoteku koja se nalazi u root direktoriju projekta
2. Koristite online Swagger Editor (https://editor.swagger.io/) za pregled dokumentacije
3. Učitajte Swagger datoteku u editor za interaktivni pregled API-ja

## PayPal Integracija

Za testiranje PayPal funkcionalnosti, koristite sandbox kredencijale koji su konfigurirani u `application-local.properties`.

## Dodatne informacije

### Backend Port
Backend aplikacija radi na portu 9090.

### Frontend URL konfiguracija
Frontend aplikacija je konfigurirana da pristupa backend API-ju na `http://localhost:9090/api`. Ako promijenite port backend aplikacije, morate ažurirati i URL u frontend aplikaciji (ApiService.ts).

### Upload slika
Slike se pohranjuju u `src/main/resources/static/images/uploads` direktoriju na backend strani. Maksimalna dopuštena veličina za upload je 2MB.

## Napomene

- Aplikacija trenutno nema deployment, koristi se lokalno
- Za pregled API dokumentacije potrebno je ručno pokrenuti Swagger file koji je uključen u repozitorij
- `.properties` datoteke s konfiguracijskim postavkama dodane su u `.gitignore` radi sigurnosti
