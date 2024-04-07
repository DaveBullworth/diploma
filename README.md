# STORAGE prj
Development of software for optimization of inventory accounting of equipment at the technological division of JSC Savushkin Product.

## Technology Stack

![Alt Text](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*ptqverAyBpdfUDhrs2g_3A.jpeg)

#### PERN Stack:
- ***PostgreSQL***
- ***Express***
- ***React***
- ***Node.js***

### Backend

- **Programming Language:** Node.js
- **Database:** PostgreSQL
- **Framework:** Express.js
- **ORM:** Sequelize
- **Password Hashing:** bcrypt
- **CORS Support:** cors
- **Environment Variables:** dotenv
- **JWT Token Handling:** jsonwebtoken

### Frontend

- **Library:** React.js
- **State Management:** Redux Toolkit
- **HTTP Client:** axios
- **Component Library:** Ant Design
- **Routing:** react-router-dom
- **Styling:** Sass
- **JWT Token Handling:** jwt-decode

## Installation and Running

### First run 

1. **Clone the repository:**
    ```bash
    git clone <URL>
    ```

2. **Install dependencies:**
    In the `client` directory:
    ```bash
    cd client
    npm install
    ```

    In the `server` directory:
    ```bash
    cd server
    npm install
    ```

### After installation

3. **Running the application:**
    In the root directory:
    ```bash
    npm run dev
    ```
    This command will start both server and client simultaneously using concurrently.

## DataBase schema

[Link to Diagram](https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&title=diplom_diagramBD.drawio#R7Z3vk6I2GMf%2FGmfaF%2BvwW3256m6v19vrTrc3bV%2FdRIlKD4nFeK731zdgQOABBRYM3uXmxpUQIySfhG%2Be50ns6ZP16y8%2B2qyeiI3dnqbYrz192tM0VR0Z7E%2BQcuApmqYcU5a%2BY%2FO0U8KL8w3zxCjbzrHxNpWREuJSZ5NOnBPPw3OaSkO%2BT%2FbpbAvipr91g5b8G5VTwsscuRhk%2B8ux6eqYOtQGp%2FR32Fmuom9WrdHxzBpFmXnB2xWyyT5Rqv7Q0yc%2BIfT4bv06wW5Qe1G9HD%2F3WHA2vjAfe7TMBz5%2B2kwt78UwFPvT%2B5fnh1%2F36u6Ol%2FIVuTt%2Bw5%2B22OcXTA9RLWz3ztpFHjsaL4hHX%2FgZhR3PV45rf0AHsguuYkvR%2FEt0NF4R3%2FnG8iOXnVJZAjvtU97IupLK8RJ8kpfp4y3L8xzdmppJekKvqYwf0JZGV0NcF222ziy8vuCDa%2BQvHW9MKCVrnmm%2Fcih%2B2aB5kGfPwA0uhK6ji1w4rjshLvHDe9cXi4U2n4cX75MvOHHGtmaWabEzsCmiesU%2Bxa%2FZNme9BZM1pv6BZeFn79SIE95T7owBT9ifuFMNnrZKMjfiiYizvoxLP%2BHA3nAiKtBhKQAPlj8LB7tDerZ6iioUuc7SY2kuXgQFBJXlsJ53z5PXjm0H3zHesqZyvOWHMNvUOKX8wSshSCLs4ws37GAr9kHMShhviOPRsFLMMfvP7mai9M2eya5iwo7V0zH7H2T36YR47EaQEzYkZmDtcQDX2CcUUTSLsb%2FAECTibPe7jAmnQi%2FJhNEWEhogwiWsf0koBEJRdqBoDQodQLFB2%2B2e%2BHKwEMmFqooGwwJgeGiNJRQioTBFQ6FC0TlBFC8JL1sKT06%2FiYe2kdcvhtpMt1oTnqV1p9kaIVBlVNCdce0U1accNdTbE54qFBmVniWSihaoEK48VRNKT7J1qMMqrqffszOsZlkJQSWXFR2D0UxR8kQHtqToqAmKeCmqQi3aY1UyYq9qbzgO3o8fw9dhmKKG7%2B%2FDVwXA8yPrEkUxFbzgd55W5exfXpdSFHU6njSjV7poJ1MHb9Erce0U1fN3POAUIVR2ILJK49MZHTMErOy22O9LM1rTD6nKbIhXMyPAhs1mxnIk6eJIIl7SRE%2FCjKQZD7hoyZc0w5q6WJsOrDxdbCloxB6AEq5G4RJupdOglS7Uy2fgYq%2BTz6VF9VCK6rxeVFpUx%2F2xAVGtW3VFdSyomgfwTUZAOVrVHq0q4NMVUa3leCC5Gahv4%2B28vK6Wxp%2Fm8RCuqzWjslAKnmUhOp8XaE7zXFNFCFnzIZ4tIEI2wsOFRKgeQh0Q29DS%2FN8OedSh5dGQD6UrPpQ6IKGhyXm37gciRvkpHG3M8NXoR0NPPCRN%2Bj%2BXhureVBQjByp7qCgDXULVLFQj4VBBG9EzlzpyQpWn2Io1XgMTp9rBE%2FEEq%2FlgvCpBu9%2Fz2NAAD%2Bd74O3Mj3RozKkWiCenRc1TIXxapMNZs5wsi6ZC%2FExHh7NlFDScK8cLsWQIn9Do%2BTE0ge1E7Q2PdpQHMJnREulGwsqiJeZA46PFRQImFDDhkxsd2vwrG1kkGi2g0QEJC2OspDGlU8aU6lCJV8DQmBKNN5%2FXVcKx5JjTwqxZvBKGsXpzvlKpLxcfCOdDuB6OCr5OAJZ0LLYBkXDNa0Db3Ay7xFvGmMShDHIhi3BeDOFC2IJzJIAE9uz7YPMbdvTwxxp5h3Tt%2BGTn2djmVRm6ho7OHVXrpb09bKwas8LSR49OcMXhZ1n1%2Boe%2Fg4P%2BQB1GCf%2BECaPhIEqYvibzTw%2FJo2fsO6xmsB8lvjr0WKLBmud4%2FA%2B%2F8OD9qazg4JA4yJYU3giohzA1cQsVUdmSnT%2FHJfoz%2B5olPldilBHb0RZEBeglUDNzSIvSfOwi6nxNlpWPH%2F%2BG56B3nlxZUTER6FkH1fHG%2BYdODINysi4xUNCxYkBBrKHQIZGNDx6F15sJWTT4QF50WcN0dlM9n11VzhbP3hyv99SP4wZ7w6Mgp2uXiLkF3f9H9vvGaqhYP8Ee%2F%2FaA2bJT2XhS07yOgN6cCvGyUlxefALEvfN2%2FL4GDFqTMY1doUO49cuA5o3K1nZJRgtkiPcBG9AwKq3tXbK214BKuLnMgpaO2Nq%2BW%2F%2BUWBv2EArbafhqVABKjkZtgCPcRBaRm1ze45Ovjp2zVa1E44poiFe4JgxWqrRkXmLRBhbCpa0JJz4AiVaNpNwseqf0mZRJ20UVXatlF00ZXmHblTU7RobMjpgdswH0UctVNjuO0gVlN%2FspsDo2ZbozYXjKdYFLWeVjE%2FpopPdOJnTGnmb2qprRC1G7aArvGGp6BjWjJmrA%2BGcOr8sanLf%2FIINbR0ACW5Bld0ItPWhFO%2F4UltQ2SnCeL1G6Kkpg5426LOmmYJYs6IA4rUy00DpQn95sG%2Fx552Af%2BfOV3PA5d%2FO2pY9sB2fsQ%2FYojCBr9VdIgO%2FWKCnkW1vNaMH5nVzN2AIq53t0Jz1edPnbv0%2FLP9%2FbH9%2FNvhiPk8%2Bv%2BvucHzRC83B4LmsQkDsrNrydfBx5Ic6ZATUOX5dUYpOyerGacifGMp6NJuhSRI84GqAL2ZXWDsgBp2EkyoqW1pCAQjgM4zLTSyDZ6zQx7Fh8ONIU6FONXK7xKksTfPxRSuk8D%2FIZn3N7w5SZndSVdqE18psquUxW0dHSUV%2FrcXZ2LLgdCQ1dJ5XWOklWrsfKNf1suVcMNwSQP7%2FSpBxqBpOrxpPlXnKOmbm9hXJym8V2VY04445cb3k7EzMggoVPy3J%2BeBLAcH0ffS%2Fpn7%2FgnY%2FcZWov5Skze%2Bf9ZIWtmfTgn%2B1xlxez8YdSZ9xqWWdYxkVf3tdvnS%2BoOadafgNA85JAZk%2BrPc0UgXX5u7VgpWyQ0V28TLAyV4MMV%2FqVucoxip%2FhyiOhHamQqsIW%2Fu4azjQuldR2y1ULbbz1lgP1bd1sw%2BXsnveGhqsjIOoLAatbUGQWq9%2FVDZq5SFfbTFQLG73IRNMCMfmAPjex7wgXg4wvSKuLxSW%2B2saiWoTnrY%2FxTTVbtpw2Q%2BDy2010OOUthT5ebq3S3VW5XrvnB0rBR3voYv11Cppf2r1bsTZlowDiEVzcatecn6YP71BCIQyKa%2FpBDDz4%2BPTtZXZwPe%2BZ%2Fn5vPz98yAlPbHgFtPR9tOL7AEt%2BrhpklG8agxpx45N%2F8ZxKWDoGi3pNz1k%2BLDnzzLIxsEpf%2FkD9tZ9ccLxpMc6VHfqE0KQkZve0eiI2DnL8Dw%3D%3D)