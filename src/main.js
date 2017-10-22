const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;

let win;
function createWindow() {
	win = new BrowserWindow({
		show: false,
		'icon': __dirname + './images/icon.ico',
	});
	win.maximize();
	win.show();
	win.loadURL(`file://${__dirname}/index.html`);
	// developer toolの表示
	//win.webContents.openDevTools();  
	win.on('closed', function(){
		win = null;
	});
}
app.on('ready', createWindow);

app.on('window-all-closed', function(){
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', function(){
	if (win === null) {
		createWindow();
	}
});