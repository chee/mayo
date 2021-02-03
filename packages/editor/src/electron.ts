import {app, BrowserWindow, remote} from "electron"
import path from "path"

if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit()
}

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
	})

	mainWindow.loadFile(path.join(__dirname, "index.html"))

	mainWindow.webContents.openDevTools()

	mainWindow.webContents.on("did-finish-load", () => {
		mainWindow.webContents.send("asyncChannelToRenderer", "hello")
		mainWindow.webContents.postMessage("hello", "hello")
	})
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
