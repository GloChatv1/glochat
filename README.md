### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/GloChatv1/glochat
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Run the server
   ```sh
   node server.js
   ```
5. Visit the site
   ```sh
   http://localhost:3000
   ```
   or
   ```sh
   http://192.168.x.x:3000

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Admin Commands

This section provides an explanation of all the admin commands available in the GloChat application:

1. **`list`**
   - **Description:** Lists all users currently active in the chat in the server console.
   - **Usage:** `<list`

2. **`give-admin`**
   - **Description:** Grants admin privileges to a specific user.
   - **Usage:** `<give-admin username`
   - **Example:** `<give-admin JohnDoe`

3. **`remove-admin`**
   - **Description:** Removes admin privileges from a specific user.
   - **Usage:** `<remove-admin username`
   - **Example:** `<remove-admin JohnDoe`

4. **`reset`**
   - **Description:** Clears the message history.
   - **Usage:** `<reset`

5. **`msg`**
   - **Description:** Sends a message with a specified color.
   - **Usage:** `<msg color message`
   - **Example:** `<msg red "Hello, everyone!"`

6. **`msgas`**
   - **Description:** Sends a message as another user with a specified color.
   - **Usage:** `<msgas username color message`
   - **Example:** `<msgas JohnDoe aquamarine "Hello from admin!"`

7. **`as`**
   - **Description:** Sends a message as another user.
   - **Usage:** `<as username message`
   - **Example:** `<as JohnDoe "Hello from JohnDoe!"`

8. **`anon`**
   - **Description:** Sends a message anonymously.
   - **Usage:** `<anon message`
   - **Example:** `<anon "Hello, it's a secret!"`

9. **`ban`**
   - **Description:** Bans a user from sending messages or images into the chat.
   - **Usage:** `<ban username`
   - **Example:** `<ban JohnDoe`

10. **`unban`**
    - **Description:** Unbans a previously banned user.
    - **Usage:** `<unban username`
    - **Example:** `<unban JohnDoe`

11. **`msganon`**
    - **Description:** Sends an anonymous message with a specified color.
    - **Usage:** `<msganon color message`
    - **Example:** `<msganon aquamarine "This is a secret message!"`

These commands are essential for managing user interactions and maintaining control over the GloChat environment.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

