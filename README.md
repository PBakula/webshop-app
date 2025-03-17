# Webshop Project

Webshop aplikacija s funkcionalnošću pregleda proizvoda, kupovine i administracije, koja koristi Java Spring Boot backend i React TypeScript frontend.

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


## Konfiguracija

Aplikacija zahtijeva postavljanje sljedećih konfiguracija:

1. U `application-local.properties` trebaju biti konfigurirani:
   - Podaci za MySQL bazu podataka
   - JWT secret ključ
   - PayPal sandbox kredencijali
   
Primjer konfiguracije (zamijenite sa svojim podacima):
```properties
# Baza podataka
spring.datasource.url=jdbc:mysql://localhost:3306/webshop_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Secret
jwt.secret=your_secure_jwt_secret

# PayPal
paypal.client-id=your_paypal_client_id
paypal.client-secret=your_paypal_client_secret
paypal.mode=sandbox
```

## Instalacija i pokretanje

### Preduvjeti
- Java 17 ili novija
- Node.js i npm
- MySQL server
- Maven

### Backend
1. Klonirajte repozitorij
2. Kreirajte bazu podataka:
   ```sql
   CREATE DATABASE webshop_db;
   ```
3. Kreirajte `application-local.properties` prema gornjem primjeru
4. Pokrenite aplikaciju:
   ```bash
   mvn spring-boot:run
   ```

Backend će biti dostupan na: `http://localhost:9090`

### Frontend
1. Navigirajte u direktorij `webshop-react-app`
2. Instalirajte ovisnosti:
   ```bash
   npm install
   ```
3. Pokrenite aplikaciju:
   ```bash
   npm run dev
   ```

Frontend će biti dostupan na: `http://localhost:5173`

## Napomene

- Aplikacija trenutno nema deployment, koristi se lokalno
- Za pregled API dokumentacije potrebno je ručno pokrenuti Swagger file koji je uključen u repozitorij
- `.properties` datoteke s konfiguracijskim postavkama dodane su u `.gitignore` radi sigurnosti