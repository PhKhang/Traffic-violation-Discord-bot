# Vietnamese Traffic violation Discord bot
Features:
- Find by plate's number and/or vehicle type (default is motor bike) \
    ```/checkvar plate:59E1XXXXX```
- Save plate's number for later lookup \
    ```/checkvar```
- No logins, just add it to any server

## Local run
- Install dependencies \
    `npm i`
- Run `index.js`\
    `npm run dev`
    
- Deploy new features\
    `npm deploy-commands.js`\
    On local enviroment, it should only deploy to test server in the deployment script. On production server, `.env` is added with a new key to deploy to all guilds.

## Made with 
- [discord.js](https://discord.js.org/)
- [Azure Linux virtual machine](https://azure.microsoft.com/en-us/products/virtual-machines/linux)
    

# Todo
- [x] trim + remove spaces
- [x] check database
- [x] remove dashes, periods
- [x] show violations if exist
- [] choose plates command
- [] auto choose plate by recent, not lookup amount
- [] image extraction
- [] cloudflare worker
