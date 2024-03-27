# STORAGE prj
Development of software for optimization of inventory accounting of equipment at the technological division of JSC Savushkin Product.

## Technology Stack

![Alt Text](PERN.webp)

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

[Link to Diagram](https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&title=diplom_diagramBD.drawio#R7Z3vk5o4GMf%2FGmfuXqzDb%2FXlqrvX3rQ3O93ZueurTpSoXJF4EOvav%2F4CJCA8oODKxu2m03HNQxJC%2BCR58k3AnjlZP%2F8Ros3qM3Gx3zM097lnTnuGoesji%2F2JLXtuMQwttSxDz%2BW23PDo%2FcTcKKJtPRdHhYiUEJ96m6JxToIAz2nBhsKQ7IrRFsQvnnWDlvyMWm54nCMfg2h%2Fey5dpdahMcjtH7C3XIkz684oPbJGIjLPOFohl%2BwOcjXveuYkJISm39bPE%2BzHtSfqJU13X3M0K1iIA9okwV9Pm6kTPFqW5j79%2Bfhw93Gnb294Lj%2BQv%2BUX%2FBThkBeY7kUtRDtv7aOAhcYLEtBHfkRj4fnK891PaE%2B2cSkiiubfRWi8IqH3k8VHPjukMwM7HFJ%2Bk02tEOMxTsnzDHHE4jyIS9NLps%2FouRDxE4qoKA3xfbSJvFlSvjjhGoVLLxgTSsmaR9qtPIofN2gex9kxcOOC0LUo5MLz%2FQnxSZhcu7lYLIz5PCl8SL7jgyOuM3Nshx2Bt0LUKw4pfi7fc9ZaMFljGu5ZFH70Rhec8JZyY5ncsMu50y1uWx0wZ4iIiLO%2BzHLPcWBfOBEt6HA0gAeLX4aDXSE9Wj11FYp8bxkwm48XcQZxZXms5d1y89pz3fgc44jdKi9YfkqiTa3c8oVXQmwiLPnCTxrYiiXELIfxhngBTSrFHrP%2F7GomWt%2Fu2awUExbW8zD7H0cP6YQE7EKQl9xIzMDa4RiucUgoomiWYX%2BCIUjE0eZ3GhNORVMmrK6QMAARPmHtS0EhEYqBbChMAMUGRdGOhKqzkMmFrssGwwFgBGiNFRQyobBlQ2EBKHqsQsbsU%2B8Nx8n3%2B%2BRzmFj05Pstt5i3LCmreXYGe9oYJE3Tp%2BMJBEnTbA0vfm2QYoe92HbYvy4BG8kGTIezmgmieEl43mpmw7tXGw9dq6q9DI2Z6XQ2s2nqr2Rd1eUJgW5si4lNVjt19fkL9yZNe423N7PRoRfbyllRVHRAhfSpjW7DuQ2JPOqxijvTGXEHo5mmVXm12FFe7ZmgyJ%2Fr6HCyE%2FusoyZ%2BrQbgec9%2BSeaV17mu9f79BfyV84XYzPO9PFuDl%2FgravZz%2FuzHaYzP1fgxQ8DKNsJhX%2Bm0lx6kWrMh35sZATZcNjNWPck19iTyXRoxEpalugF3WqpdmnNFOmM6cKr8YkdDIzYAKrguCpd0GdiAKl3iLx%2BBi31OvjV2qofKqa5qRY2d6qw9XsCpNp1znWpT7wzAF4mAqrc6u7dqgc%2B1ONVGxRI3l4H6Lo7mzf1qJf5cHg%2FpfrVRs6Z5YixL0Pm2QHNatTRVh5AzH%2BLZAiLkIjxcKITOQ%2BgKnG2oNP%2B3RQH1aHM01KD0ioPSFbjQ1ZLzyW5nu2aJfksO2Mmn1RexstST%2Fu%2BqR5LaI0nfR2FA1bnxTh2tr0TH6%2BDoCpxnqEhvQvJv%2FLiGGtiucGC7An8a6tQPfLoFkHnPok42a6yfZ0JKXr4i2piPQVeAiD6tkXbzK%2FcNF%2BDheAt8OxqNCQXldrvNlTRzeSqkDyUmVO6UYCebCvlqiwkVOxTfOF%2F1F3LJkC6qmDWiyn0yx01FlTsglxgHdutgTmwcqCzjVH5RgEkFTLqsYsJ1x9ZCr0KjAzSuwIWFitultVpFThfkyHdzoWIiOpVv6zYSrMKjg6mxfHcXSrBz%2FkhkXz3lJJ0P6U6vyPh1dnqq9cIuIJLu2FpQgJthnwTLDJNsz5R6Yk46L413YHb3dhA4EQJI4MC9jV%2FjxkJ3X9Yo2BdrJyTbwMUur8pk%2FSddwdGNXnFJh%2FVVY5ZZMXTvxSVO0rLqDff%2FxIH%2BQB8Kw9fEMBoOhGH6fBh%2Fuj8MPeDQYzWDQ2F89miao8VuTxr%2Bygsef8%2FzigP7g0A5p%2BRCQD0k1oNLaIlKRLbhHDdoz%2Bw0S3wsRxERu%2BJlejXoHaBmV5AmbCH2EfV%2BHOZVjR8%2Fw0PcOvP1KpGNAL28CpVeOE%2BUMwzyKa97gYzSigEZsRuF9gfReOdRW97S3miLd%2BR1xRoWo9v68ei6djR79iUtb96Osxv2gqGgomk32NwPmv97XtzNvKF6%2Fwm2%2BJfvzG86le1uY74Fl2xabMxXzuXJESBrnW9ncdeCu2PV5ulroUO6%2BmVBeaO1pK7I6IAM%2BQu9FhRG1fbnt0COdE3MgXJGJqnHCCk6JNIhXewSeBY3Nf%2Fw3IrXpys0XhEN%2Bb6qDfcWtXrLhsKiCyykO6k2nMIAJDqVO7nAeaP1NS0TNFOFUzONsxTOgoQK711TAVFIklciIJb3u4s711pAHBUzKr8frEY%2FvJQIZ1c8vyVPX8%2FE8NHI7OViOGPPsHttBfECzIZTgtk6h%2BVaek%2Fq5ILe0zq5cVWYmyXMrTMxNwfl9uK8Ludw9v9OOtYrAQm8MbEsDTfuMMULympz6holqBYolF4VJfCioHNZMm3JLDlwGSN%2FiNFB69jzDWZR%2FOeDh0MUzlfq%2FfSVj30vQ%2BR6uPQUrDtK9qF1%2BqtcYAXYajiJyBJeXpWCk0v15GMHrBxv0hdfOOvuN9wqXmCeXObHaR01av9Ve0GiPRmOdDLgg07JkKLAkAtGU2n7DDBYMP%2FB0dTPyX%2B31bz7Hw%3D%3D)