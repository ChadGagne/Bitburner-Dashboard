/* --------------------------------- Imports -------------------------------- */
const fs = require('fs');
const net = require('net');
const path = require('node:path');
const { app, ipcMain, BrowserWindow } = require('electron');




/* -------------------------------- variables ------------------------------- */
let settings;
let mainWindow;
const isMac = process.platform === 'darwin';




/* --------------------------------- server --------------------------------- */
let server = net.createServer(conn => {

    conn.on('data', data => {
        conn.write(data + '\r\n');
    
            mainWindow.webContents.send("data-recieved", JSON.parse(data.toString().split('\n')[17]));
    });

    conn.on('end', () => {
    });
});

/* --------------------------- window constructor --------------------------- */
const createWindow = () => {
    mainWindow = new BrowserWindow({
        title: 'Bitburner Dashboard',
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('front/index.html');
}


/* ----------------------------------- IPC ---------------------------------- */
//wait for window to start server
ipcMain.on('mainWindow-ready', () => {
    //open settings
    openSettings();

    mainWindow.webContents.send("settings-init", settings);
    server.listen(settings.port)
});

ipcMain.on('setting-update', (e, settings) => {
    
    //close the server and start on the good port
    server.close()
    server.listen(settings.port)

    //save the settings
    fs.writeFileSync(path.join(__dirname, 'settings.json'), JSON.stringify(settings), (error) => {
        if (error) {
            console.log(error)
        }
        throw error;
    })
})


/* -------------------------------- Funcntions ------------------------------- */
//open the setting file or create one
function openSettings() {

    //Check if the file exists
    if (!fs.existsSync(path.join(__dirname, 'settings.json'))) {

        //creates the file if it does not exist
        fs.writeFileSync(path.join(__dirname, 'settings.json'), JSON.stringify({
            port: 5000
        }), (error) => {
            if (error) {
                console.error(error);
            }
            throw error;
        });

        settings = {
            port: 5000
        };
    } else {

        //Opens the file
        try {
            // reading a JSON file synchronously
            settings = JSON.parse(fs.readFileSync("settings.json"));
        } catch (error) {
            if (error) {
                console.error(error);
            }
            throw error;
        }
    }
}




/* ------------------------------- app routes ------------------------------- */
//start app
app.on('ready', () => {
    createWindow();

    //kill server when closing window
    mainWindow.on('close', () => {
        server.close();
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

//make sure server is close on close
app.on('close', () => {
    server.close();
});

//close app
app.on('window-all-closed', () => {
    if (!isMac) app.quit();
})