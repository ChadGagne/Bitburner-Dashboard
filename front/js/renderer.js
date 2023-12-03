const body = document.querySelector('body');
const menuTop = document.querySelector('aside div.top-selection');
const menuBottom = document.querySelector('aside div.bottom-selection');
const settingsPage = document.querySelector('div.settings');
const serverButtons= document.querySelector('aside .servers-button');
const settingsButton = document.querySelector('aside .settings');
const completeServers = document.querySelector('div.servers-complete');
const serveroverviewPage = document.querySelector('div.overview');
const serverOverviewButton = document.querySelector('button.overview');
const settingsSaveButton = document.querySelector('.settings button')

let currentPage;
let currentButton;
let currentDisplay;
let pages = [serveroverviewPage, settingsPage]
let buttons = [serverOverviewButton, settingsButton];

let settings

//functions

//creating the server
function createServer(serverData) {
    
    //format the values
    const ramFreeRatio = formatNumber(serverData.ram.free / serverData.ram.max * 100);
    const ramUsedRatio = formatNumber(serverData.ram.used / serverData.ram.max * 100);
    const moneyRatio = formatNumber(serverData.money.available / serverData.money.max * 100);
    const securityRatio = formatNumber(serverData.security.min / serverData.security.level * 100);
    let portsRatio;

    if (serverData.ports.required == 0) {
        portsRatio = formatNumber(serverData.ports.open / 1 * 100);
    } else {
        portsRatio = formatNumber(serverData.ports.open / serverData.ports.required * 100);
    }
    
    serverData.money.max = formatNumber(serverData.money.max);
    serverData.security.min = formatNumber(serverData.security.min);
    serverData.security.level = formatNumber(serverData.security.level);
    serverData.money.available = formatNumber(serverData.money.available);

    serverData.level = formatNumber(serverData.level);
    serverData.power = formatNumber(serverData.power);
    serverData.ram.max = formatNumber(serverData.ram.max);
    serverData.ram.used = formatNumber(serverData.ram.used);
    serverData.ram.free = formatNumber(serverData.ram.free);

    //create the template
    serveroverviewPage.insertAdjacentHTML('afterbegin', '<div class="server ' + serverData.id + '"><div class="about"><h2>' + serverData.id + '</h2><div class="state ' + serverData.state + '"><p>' + serverData.state + '</p></div></div><div class="split"></div><div class="info"><div class="money"><div class="data"><h3>money</h3><p><span class="available"></span> $ / <span class="max"></span> $</p><p class="ratio"></p></div><div class="progress"></div></div><div class="security"><div class="data"><h3>security</h3><p><span class="min"></span> / <span class="level"></span></p><p class="ratio"></p></div><div class="progress"></div></div></div></div>');
    serverDiv = serveroverviewPage.querySelector('div.' + serverData.id);
    
    //fill in the values
    serverDiv.querySelector('div.info div.money div.progress').style.width = moneyRatio + "%";
    serverDiv.querySelector('div.info div.money div.data p.ratio').innerText = moneyRatio + " %";
    serverDiv.querySelector('div.info div.security div.progress').style.width = securityRatio + "%";
    serverDiv.querySelector('div.info div.security div.data p.ratio').innerText = securityRatio + " %";
    serverDiv.querySelector('div.info div.money div.data p span.max').innerText = serverData.money.max;
    serverDiv.querySelector('div.info div.security div.data p span.min').innerText = serverData.security.min;
    serverDiv.querySelector('div.info div.security div.data p span.level').innerText = serverData.security.level;
    serverDiv.querySelector('div.info div.money div.data p span.available').innerText = serverData.money.available;

    //set the correct place
    serverDiv.style.order = serverData.level;

    //create the server page
    completeServers.insertAdjacentHTML('afterbegin', '<div class="server-complete ' + serverData.id + '"><div class="main"><div class="about"><h2></h2><div class="state"><p></p></div></div><div class="split"></div><div class="info"><div class="money"><div class="data"><h3>money</h3><p><span class="available"></span> $ / <span class="max"></span> $</p><p class="ratio"></p></div><div class="progress"></div></div><div class="security"><div class="data"><h3>security</h3><p><span class="min"></span> / <span class="level"></span></p><p class="ratio"></p></div><div class="progress"></div></div></div><div class="split"></div><div class="info"><div class="title"><h3>about</h3></div><div class="admin"><div class="data"><h3>admin</h3><div><p></p></div></div></div><div class="level"><div class="data"><h3>level</h3><p></p></div></div><div class="purchased"><div class="data"><h3>purchased</h3><div><p></p></div></div></div><div class="connected"><div class="data"><h3>connected</h3><div><p></p></div></div></div><div class="backdoored"><div class="data"><h3>backdoored</h3><div><p></p></div></div></div><div class="cores"><div class="data"><h3>cores</h3><p></p></div></div><div class="power"><div class="data"><h3>power</h3><p></p></div></div><div class="organisation"><div class="data"><h3>organisation</h3><p></p></div></div></div><div class="split"></div><div class="info"><div class="title"><h3>ram</h3></div><div class="used"><div class="data"><h3>used</h3><p><span class="used"></span> gb / <span class="max"></span> gb</p><p class="ratio"></p></div><div class="progress"></div></div><div class="available"><div class="data"><h3>free</h3><p><span class="free"></span> gb / <span class="max"></span> gb</p><p class="ratio"></p></div><div class="progress"></div></div></div><div class="split"></div><div class="info"><div class="title"><h3>ports</h3></div><div class="opened"><div class="data"><h3>open</h3><p><span class="open"></span> / <span class="required"></span></p><p class="ratio"></p></div><div class="progress"></div></div><div class="ftp"><div class="data"><h3>ftp</h3><div><p></p></div></div></div><div class="http"><div class="data"><h3>http</h3><div><p></p></div></div></div><div class="smtp"><div class="data"><h3>smtp</h3><div><p></p></div></div></div><div class="sql"><div class="data"><h3>sql</h3><div><p></p></div></div></div><div class="ssh"><div class="data"><h3>ssh</h3><div><p></p></div></div></div></div></div></div>')
    const completeServerDiv = completeServers.querySelector('div.' + serverData.id);
    pages.push(completeServerDiv);

    //fill in the values
    completeServerDiv.querySelector('div.about h2').innerText = serverData.id;
    completeServerDiv.querySelector('div.level p').innerText = serverData.level
    completeServerDiv.querySelector('div.admin p').innerText = serverData.admin;
    completeServerDiv.querySelector('div.cores p').innerText = serverData.cores;
    completeServerDiv.querySelector('div.power p').innerText = serverData.power;
    completeServerDiv.querySelector('div.ftp p').innerText = serverData.ports.ftp;
    completeServerDiv.querySelector('div.sql p').innerText = serverData.ports.sql;
    completeServerDiv.querySelector('div.ssh p').innerText = serverData.ports.ssh;
    completeServerDiv.querySelector('div.http p').innerText = serverData.ports.http;
    completeServerDiv.querySelector('div.smtp p').innerText = serverData.ports.smtp;
    completeServerDiv.querySelector('div.about div p').innerText = serverData.state;
    completeServerDiv.querySelector('div.about div').classList.add(serverData.state);
    completeServerDiv.querySelector('div.purchased p').innerText = serverData.purchased;
    completeServerDiv.querySelector('div.connected p').innerText = serverData.connected;
    completeServerDiv.querySelector('div.used span.max').innerText = serverData.ram.max;
    completeServerDiv.querySelector('div.used p.ratio').innerText = ramUsedRatio + " %";
    completeServerDiv.querySelector('div.opened p.ratio').innerText = portsRatio + " %";
    completeServerDiv.querySelector('div.used span.used').innerText = serverData.ram.used;
    completeServerDiv.querySelector('div.backdoored p').innerText = serverData.backdoored;
    completeServerDiv.querySelector('div.available p.ratio').innerText = ramFreeRatio + " %";
    completeServerDiv.querySelector('div.available span.max').innerText = serverData.ram.max;
    completeServerDiv.querySelector('div.organisation p').innerText = serverData.organisation;
    completeServerDiv.querySelector('div.opened span.open').innerText = serverData.ports.open;
    completeServerDiv.querySelector('div.used div.progress').style.width = ramUsedRatio + "%";
    completeServerDiv.querySelector('div.admin div.data div').classList.add(serverData.admin);
    completeServerDiv.querySelector('div.available span.free').innerText = serverData.ram.free;
    completeServerDiv.querySelector('div.ftp div.data div').classList.add(serverData.ports.ftp);
    completeServerDiv.querySelector('div.sql div.data div').classList.add(serverData.ports.sql);
    completeServerDiv.querySelector('div.ssh div.data div').classList.add(serverData.ports.ssh);
    completeServerDiv.querySelector('div.http div.data div').classList.add(serverData.ports.http);
    completeServerDiv.querySelector('div.smtp div.data div').classList.add(serverData.ports.smtp);
    completeServerDiv.querySelector('div.available div.progress').style.width = ramFreeRatio + "%";
    completeServerDiv.querySelector('div.opened span.required').innerText = serverData.ports.required;
    completeServerDiv.querySelector('div.connected div.data div').classList.add(serverData.connected);
    completeServerDiv.querySelector('div.purchased div.data div').classList.add(serverData.purchased);
    completeServerDiv.querySelector('div.info div.money div.progress').style.width = moneyRatio + "%";
    completeServerDiv.querySelector('div.backdoored div.data div').classList.add(serverData.backdoored);
    completeServerDiv.querySelector('div.info div.money div.data p.ratio').innerText = moneyRatio + " %";
    completeServerDiv.querySelector('div.info div.security div.progress').style.width = securityRatio + "%";
    completeServerDiv.querySelector('div.info div.security div.data p.ratio').innerText = securityRatio + " %";
    completeServerDiv.querySelector('div.info div.money div.data p span.max').innerText = serverData.money.max;
    completeServerDiv.querySelector('div.info div.security div.data p span.min').innerText = serverData.security.min;
    completeServerDiv.querySelector('div.info div.security div.data p span.level').innerText = serverData.security.level;
    completeServerDiv.querySelector('div.info div.money div.data p span.available').innerText = serverData.money.available;

    if (portsRatio > 100) {
        completeServerDiv.querySelector('div.opened div.progress').style.width = 100 + "%";
    } else {
        completeServerDiv.querySelector('div.opened div.progress').style.width = portsRatio + "%";
    }

    //create the button
    serverButtons.insertAdjacentHTML('afterbegin', '<button class="' + serverData.id + '"><img src="img/icons8-serveur-individuel-48.png">' + serverData.id + '</button>')
    const button = serverButtons.querySelector('.' + serverData.id)
    button.style.order = serverData.level;
    buttons.push(button)
    button.onclick = () => {
        buttonClick(button, completeServerDiv, 'flex');
    }

    //add the button to the serverDiv
    serverDiv.onclick = () => {
        buttonClick(button, completeServerDiv, 'flex');
    }

    buttonClick(currentButton, currentPage, currentDisplay)
}

// update the server
function updateServer (serverData) {

    //format the values
    const moneyRatio = formatNumber(serverData.money.available / serverData.money.max * 100);
    serverData.money.available = formatNumber(serverData.money.available);
    serverData.money.max = formatNumber(serverData.money.max);

    serverData.security.min = formatNumber(serverData.security.min);
    serverData.security.level = formatNumber(serverData.security.level);
    const securityRatio = formatNumber(serverData.security.min / serverData.security.level * 100);

    const ramUsedRatio = formatNumber(serverData.ram.used / serverData.ram.max * 100);
    const ramFreeRatio = formatNumber(serverData.ram.free / serverData.ram.max * 100);
    let portsRatio;
    if (serverData.ports.required == 0) {
        portsRatio = formatNumber(serverData.ports.open / 1 * 100);
    } else {
        portsRatio = formatNumber(serverData.ports.open / serverData.ports.required * 100);
    }

    serverData.level = formatNumber(serverData.level);
    serverData.power = formatNumber(serverData.power);
    serverData.ram.used = formatNumber(serverData.ram.used);
    serverData.ram.max = formatNumber(serverData.ram.max);
    serverData.ram.free = formatNumber(serverData.ram.free);

    //find the serverDiv
    const serverDiv = body.querySelector('div.' + serverData.id);
    const completeServerDiv = completeServers.querySelector('div.' + serverData.id);

    //fill in the new values
    serverDiv.querySelector('div.info div.money div.data p span.available').innerText = serverData.money.available;
    serverDiv.querySelector('div.info div.money div.data p span.max').innerText = serverData.money.max;
    serverDiv.querySelector('div.info div.money div.data p.ratio').innerText = moneyRatio + " %";
    serverDiv.querySelector('div.info div.money div.progress').style.width = moneyRatio + "%";

    serverDiv.querySelector('div.info div.security div.data p span.min').innerText = serverData.security.min;
    serverDiv.querySelector('div.info div.security div.data p span.level').innerText = serverData.security.level;
    serverDiv.querySelector('div.info div.security div.data p.ratio').innerText = securityRatio + " %";
    serverDiv.querySelector('div.info div.security div.progress').style.width = securityRatio + "%";

    //fill in the values
    completeServerDiv.querySelector('div.about h2').innerText = serverData.id;
    completeServerDiv.querySelector('div.about div').classList.add(serverData.state);
    completeServerDiv.querySelector('div.about div p').innerText = serverData.state;

    completeServerDiv.querySelector('div.info div.money div.data p span.available').innerText = serverData.money.available;
    completeServerDiv.querySelector('div.info div.money div.data p span.max').innerText = serverData.money.max;
    completeServerDiv.querySelector('div.info div.money div.data p.ratio').innerText = moneyRatio + " %";
    completeServerDiv.querySelector('div.info div.money div.progress').style.width = moneyRatio + "%";

    completeServerDiv.querySelector('div.info div.security div.data p span.min').innerText = serverData.security.min;
    completeServerDiv.querySelector('div.info div.security div.data p span.level').innerText = serverData.security.level;
    completeServerDiv.querySelector('div.info div.security div.data p.ratio').innerText = securityRatio + " %";
    completeServerDiv.querySelector('div.info div.security div.progress').style.width = securityRatio + "%";

    completeServerDiv.querySelector('div.admin div.data div').classList.add(serverData.admin);
    completeServerDiv.querySelector('div.admin p').innerText = serverData.admin;
    completeServerDiv.querySelector('div.level p').innerText = serverData.level
    completeServerDiv.querySelector('div.purchased div.data div').classList.add(serverData.purchased);
    completeServerDiv.querySelector('div.purchased p').innerText = serverData.purchased;
    completeServerDiv.querySelector('div.connected div.data div').classList.add(serverData.connected);
    completeServerDiv.querySelector('div.connected p').innerText = serverData.connected;
    completeServerDiv.querySelector('div.backdoored div.data div').classList.add(serverData.backdoored);
    completeServerDiv.querySelector('div.backdoored p').innerText = serverData.backdoored;
    completeServerDiv.querySelector('div.cores p').innerText = serverData.cores;
    completeServerDiv.querySelector('div.power p').innerText = serverData.power;
    completeServerDiv.querySelector('div.organisation p').innerText = serverData.organisation;

    completeServerDiv.querySelector('div.used span.used').innerText = serverData.ram.used;
    completeServerDiv.querySelector('div.used span.max').innerText = serverData.ram.max;
    completeServerDiv.querySelector('div.used p.ratio').innerText = ramUsedRatio + " %";
    completeServerDiv.querySelector('div.used div.progress').style.width = ramUsedRatio + "%";

    completeServerDiv.querySelector('div.available span.free').innerText = serverData.ram.free;
    completeServerDiv.querySelector('div.available span.max').innerText = serverData.ram.max;
    completeServerDiv.querySelector('div.available p.ratio').innerText = ramFreeRatio + " %";
    completeServerDiv.querySelector('div.available div.progress').style.width = ramFreeRatio + "%";

    completeServerDiv.querySelector('div.opened span.open').innerText = serverData.ports.open;
    completeServerDiv.querySelector('div.opened span.required').innerText = serverData.ports.required;
    completeServerDiv.querySelector('div.opened p.ratio').innerText = portsRatio + " %";
    if (portsRatio > 100) {
        completeServerDiv.querySelector('div.opened div.progress').style.width = 100 + "%";
    } else {
        completeServerDiv.querySelector('div.opened div.progress').style.width = portsRatio + "%";
    }
    completeServerDiv.querySelector('div.ftp div.data div').classList.add(serverData.ports.ftp);
    completeServerDiv.querySelector('div.ftp p').innerText = serverData.ports.ftp;
    completeServerDiv.querySelector('div.http div.data div').classList.add(serverData.ports.http);
    completeServerDiv.querySelector('div.http p').innerText = serverData.ports.http;
    completeServerDiv.querySelector('div.smtp div.data div').classList.add(serverData.ports.smtp);
    completeServerDiv.querySelector('div.smtp p').innerText = serverData.ports.smtp;
    completeServerDiv.querySelector('div.sql div.data div').classList.add(serverData.ports.sql);
    completeServerDiv.querySelector('div.sql p').innerText = serverData.ports.sql;
    completeServerDiv.querySelector('div.ssh div.data div').classList.add(serverData.ports.ssh);
    completeServerDiv.querySelector('div.ssh p').innerText = serverData.ports.ssh;

    state = serverDiv.querySelector('div.about div.state')
    state.querySelector('p').innerText = serverData.state
    classes = state.classList
    state.classList.remove(classes[1])
    state.classList.add(serverData.state)
}

//formatting numbers
function formatNumber(number) {

    //create the variables
    let output = "";
    let remainder;
    const isRound = number == Math.round(number);

    //if the number has decimal, remove them
    if (!isRound) {
        number = Math.round(number * 100) / 100;
        remainder = Math.round((number % 1) * 100);
        number = number - number % 1;
    }

    //create the digit array from the new number
    let digitArray = String(number).split('');

    //format the number with spaces
    for(let digit = 0; digit < digitArray.length; digit ++) {
        output += digitArray[digit];
        if (digit % 3 ==  (digitArray.length - 1) % 3  && digit != digitArray.length - 1) {
            output += " ";
        }
    }

    //if the number had decimals, add them back
    if (!isRound) {
        output += "." + remainder;
    }
    
    //return the number
    return output
}

//button clcik
function buttonClick(buttonElement, page, display) {
    currentPage = page;
    currentButton = buttonElement;
    currentDisplay = display;

    let rect = buttonElement.getBoundingClientRect();
    menuTop.style.transition = "height 1s"
    menuTop.style.height = rect.top + "px"
    menuBottom.style.height = (window.innerHeight - rect.bottom + 50) + "px"
    pages.forEach(element => {
        element.style.display = 'none'
    })
    if (page) {
        page.style.display = display
    }
    buttons.forEach(element => {
        element.style.filter = ''
    });
    buttonElement.style.filter = 'invert(100%)'

    if (page != settingsPage) {
        initSettings();
    }
}

//innit settings
function initSettings() {
    settingsPage.querySelector('input.port').value = settings.port
}

//event listeners
//window is loaded
window.onload = () => {
    ipc.send("mainWindow-ready");
}

//recieves data
ipc.on("data-recieved", (data) => {

    //adapt the data
    if (data.id === 'n00dles') {
        data.level = 0;
    }

    //create or update the server
    if (!document.querySelector('div.' + data.id)) {
        createServer(data)
    } else {
        updateServer(data)
    }
});

serverOverviewButton.onclick = () => {
    buttonClick(serverOverviewButton, serveroverviewPage, 'flex');
}

settingsButton.onclick = () => {
    buttonClick(settingsButton, settingsPage, 'flex');
}

window.onresize = () => {
    buttonClick(currentButton, currentPage, currentDisplay)
}

settingsSaveButton.onclick = () => {
    settings.port = settingsPage.querySelector('input.port').value
    ipc.send('setting-update', settings);
    initSettings();
}

ipc.on("settings-init", (data) => {
    settings = data;
    initSettings()
    buttonClick(serverOverviewButton, serveroverviewPage, 'flex');
})