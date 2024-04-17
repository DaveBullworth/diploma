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

### Client

**First Run**

1. **Clone the repository:**
    ```bash
    git clone <URL>
    ```

2. **Build Docker container:**
    In the `client` directory:
    ```bash
    cd client
    docker build -t client .
    ```
    
**Subsequently**
    
1. **Run the Docker container:**
    Notice `REACT_APP_API_URL` declaring an environment variable to determine the ip of the server computer:
    ```bash
    docker run -e API_URL='http://<server-local-ip>:5000/' -p 80:80 -d client
    ```
    Replace `<server-local-ip>` with the local IP address of your server.

**Notice**

1. If you do not specify an environment variable for the `ip server` when launching the container yourself, the default variable from .env will be = `http://localhost:5000/`.
2. Please note that when using Chrome browsers as a working environment, you may need to extend eliminates the CORS restrictions imposed by your browser.
    
### Server

**First Run**

1. **Clone the repository:**
    ```bash
    git clone <URL>
    ```
    
2. **Install dependencies:**
    In the `server` directory:
    ```bash
    cd server
    npm install
    ```
    
3. **Install dependencies:**
    Ensure PostgreSQL is installed and running on your system.

**After installation**

1. **Running the application:**
    In the `server` directory:
    ```bash
    npm run dev
    ```
    This command will start the server and connect to the PostgreSQL database.

## DataBase schema

[Link to Diagram](https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&title=diplom_diagramBD.drawio#R7Z1fk6K4FsA%2FjVV7H9riv%2FLYavfOzk7P9p2%2BU3fnvnRFico0gos4tvPpb8CAwAkKNhDsSdeUIyFESH45OTnnJPTU8er1dx%2Btlw%2BehZ2eIlmvPXXSUxRZVzXyX5iypymaJB1SFr5t0bRjwpP9E9PEONvWtvAmkzHwPCew19nEmee6eBZk0pDve7tstrnnZH91jRb0F6VjwtMMORhk%2B69tBctD6lAZHNM%2FYHuxjH9ZNszDmRWKM9OCN0tkebtUqepdTx37nhccvq1ex9gJay%2Bul8N19wVnkxvzsRuUueDz1%2FXEcJ80TbK%2Bfnx6vPtjJ29vaCk%2FkLOlD%2Fx1g316w8E%2BroXNzl45yCVHo7nnBk%2F0jESOZ0vbsT6hvbcN72IToNlLfDRaer79k%2BRHDjklkwRy2g9oI6tSJsdTeCUt08cbkucxfjQ5l%2FSAXjMZP6FNEN%2BN5zhovbGn0f2FF66Qv7DdkRcE3opm2i3tAD%2Bt0SzMsyPghjcSrOKbnNuOM%2FYcz4%2BeXZ3P58psFt28773g1BnLmBq6Qc7ApojrFfsBfs23Oekt2FvhwN%2BTLPTsjaxSTmhPudF1mrA7cke6zyFtmWbOpImIsr5ISj%2FiQL5QIirQYUgAD5I%2FDwd5wuBk9RRVKHLshUvSHDwPCwgryyY975Ymr2zLCn9jtCFNZbuLT1G2iXZM%2BUIrIUzyyOVzJ%2BpgS3IhJiWM1p7tBlGl6CPyjzzNWOrrPZ3cxZgcy8dj8i%2FM7gdjzyUPguyoITEBa4dDuEa%2BF6AATRPszzAEiTjZ%2Fc5jQqlQSzKhNYWEAohwPNK%2FBBQcoRjwhkIFUKzRZrPzfCEseHIhy7zBMAAYLlphAQVPKMqqFY1BIUOlc4wCvPBo2ULxpPTreGhprH4xVKaqUZviqeQUz7LDSUJS%2FYRALaOC3pnUTlF9CqkhX5%2FiKUMlo9JYIqhogArumqesQ9XT29iBTSqup96SM6RmSQlhJZdVOgbmVJJYSgc2hNJxISj8VVEZ6qI9UiUm%2BZR7w1H4fXQffQ6jFDn6fht9SgCeX1kvkSRdwnP65FmtnPyxupQkyZPRuB59BagrWml9pTE7mTx4i76S1E5RPb9jgVOEUFlBZJTGpzN6zBCwst1gvy%2FMaHUPUpXZ4K%2FNmIANi8yMhSTpoiThr9LEI2FOpRkNqNLCVmmGF%2BrFymRgsPRiQ0ImGQAFXLXCxd1Kp0ArXaQvn4CLfI6fSyvVQ6FUs3pRaaU66Y81KNWqcalSnShU9QP4JiOgkFYXS6sK%2BHRFqVYYHkhqBupbeDMrr1cL40%2F9eHDXqxWtsqIUjmUROs9zNAtYrqkihIzZEE%2FnECEL4eFcIHQZQh1QtqGl%2BZ8tcgM7KI%2BGGJRaHJQ6oEJDk%2FN21Q%2BVGOm3SNro0afWj0VPIpLG%2FX%2BVhupWlySNAZU1lKSBKqCqFyqTO1TQRvRIVR0xoWJpbMU6Xg0Tp4uDJ5IJVv3BeFWCdt%2BzbKiBh9M98HrmRyo05lQLxBPTovqp4D4tUuGsWUyWeVPBf6ajwtkyChvOEfKCLxncJzQqO4YmtJ3IveHBjnIHJjNKKl1LWVmU1BxodLC4CMC4AsZ9cqNCm39lI4tAowE0OqDCwhgrYUzplDGlOlT8NWBoTInlzfOqSjiWkDkNzJr5a8IwVm9GVyr1xeID7nxw14fjgtsJwBKOxSYg4q7zatA2N8WO5y4STJJQBrGQhTsvGndF2IBzJIAEdq3bcPMbcnT3ZYXcfbZ2fG%2FrWtiiVRm5hg7OHVnpZb09RFaNSGHZo3s7vOPoWlK9%2Fv7v8KA%2FkIdxwrcowRwO4oTJazr%2FZJ8%2BesS%2BTWoG%2B3Hiqx0cStRI8xyOv9EbD78fywoP9qmDfEnRg4B6iFJTj1ARlY239We4RH8mP7PAp0qMM2Ir3oKoAL0UajqDtDjNxw4K7B%2Fpstj40V94DHvn0ZUVFxODnndQHR6cXnRkGJSTd4mBgg4VAwoiDYX2qWxUeBTeby5kUaOCvOi2htnsunw6uyydLJ58OdzvsR8nDfaGoYDRtUvE3ILu%2Fyv7fRNtqFh%2Fgj3%2B7QGzZaeyyaSmfj0CenMqxMsK5fLsCJD0zuvx%2B2owaE3ENHaFDu7WLw2aNypb2wUZDZDB3wesQcOosLZ3ydp%2BAVTczWUGtHQk1vbt6rfU2rC7SLGdRJ9aBaCENGoCHO4mspjc9PIe3%2FthW4ytagUaLaLBX8PVYbBSpSXzAosmsOCu2upw4gOQaNRISs2iN1KfqDJZu6ikKhfZRTOGV9h2Zc2OsSGzI2bHfAB93HKVzY5mtqD8Zj8FVse6THc6DE9pF7iMVT4xoZum2jua0Al7it6rakYvRO2sKbxjqOV3WNcuRA0Y%2F%2FRhu6zBefv7Em5pfrUMvwNdbZPfTuEbX3HEtyYPDSypaYChdeF9AVyIXFdQAvt9XMqSGrclL5YM6PY4roc00CrUed3pJvzvg4195M%2BWYptp5pZxCx9ZNs5ZpSwziltr9N0nwGOslZw%2BNLaG0oCzSrGGsgFUTvfoTvrZgsWf3x8W%2F%2Floff4wfdHux8%2Bv6kfGa5TQLBLPZc0QYj%2FHmt%2BelOjo%2FFwoUMehq6FKbI12WYSo2P%2BxjD%2BlBrqSaCJuEkcBdCGr0ooFIXBqFjgKbySgIhwFj%2BnZhZfkc5ISOwYVR4oEPbmxozdZ26mDy%2B%2BFKs3yW5%2FwdDcnpvT8pK60466WN7kwmayiR4vwgIuGs5Oy4HpUaOiwqbTCSrDSHitteveYdwy3IRAvfalTHaoHk1aj2Ji3zDAzN7c8T2zu2KxWw8%2B4I1Z5Xs%2FEDCjBZW3JzeHD2Ei%2FVWcX07PaS3tVz8QExO4yuZfxlOm9036ywtZM%2B11P9rjzS%2BjooNQZt1reGZYLDCgfYWCcLqg%2Bpxq7AaB5iSOzxzWmeobAS%2Fm7thCpfGjTTbI4sTJXgxxXastcMYziJ7hyvciOVEhVYQu%2Fu4bTtXMlNd1y1QIqr73lQH0bV9twjD373tBwlygQlysCRregyC2Rv7k0aOYsXU0zUS1Y9SwTdSuI6QH61MS%2BI1wMcvEryqVYnOOraSyqxZVeu4yvq9ny5TQZAsduN97hlNcU%2Bni%2BtUp3V6m9dmcHSsGhPXKx%2FjEBzS%2Fs3o1Ym%2FKRi4kE57fGFurphycUUHCDok0%2FiIYHnx9%2BPk33jus%2BBn%2FdWo93nxjhiTWvuxa%2Bj0Z8H2ChkdKmNZttGoM64tr3vuNZIGDpGCwy9xBYhTHPLBsDK%2FW3G%2Bz3HW8hohrbGrmgvJFaRGihKvPB9svLP7vvf76gH96%2FH3c%2FGEMXgIHDstrY3vUtdeYNtq%2BTy%2B7PeyuoSO7IBKs2J5iWn1%2FJ%2Bb3z6ptfMdlTmNIrsxvjber7AJD5K8fCYsOSLMwS0qZpyMOwBzFWEVn6QDWteqRZPhSgdNA%2B4Kw2afamLRqTeiuq6Xc8uFVD5WRv7mRILPOOGZs3VtnaRvDSLi9thsUy75hhvs%2BPV4zdg5%2FPDGqH72JoS3Ug2dLxgNnljIGKaloVnVfGOzB8QT9DleErrpui2nzH4qikyBmWZqQrQxQjNjZ5W4V4lyhnOrgPSBXjDH5txySYrphatohL%2FZKgoKanzdWC%2FFoKHg33%2BlHVXiZARRqavdMhKsy9frpOUn53H8VULyOJqCB9KfUn54vtq5p5%2FGuVsoJX0TazKEPoLrVaYlp9iZL1Wf9rbX74%2Fe%2F%2FOXevXww03q%2FQ2zdsEZPr1ux2rb6ijUkLNARXpUXIjzqnwlqbmi2TCGjITaY921W1d4OKleutuMNblSLs2RAUI5VftyIESb2CpEFFhBz6nhektV7ySMsHz8Jhjv8D)