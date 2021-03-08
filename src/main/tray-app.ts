import { app, BrowserWindow, Menu, NativeImage, Tray } from 'electron';

export class TrayApp {
  private tray!: Tray;

  /**
   * @param trayIcon icon of the tray
   * @param popoverWindow popover window when the tray icon clicked
   */
  constructor(private trayIcon: NativeImage, private popoverWindow: BrowserWindow) {
    this.setupTray();
    this.setupPopoverWindowOptions();
  }

  setTrayIcon(icon: NativeImage) {
    this.trayIcon = icon;
  }

  setPopoverWindow(window: BrowserWindow) {
    this.popoverWindow = window;
    this.setupPopoverWindowOptions();
  }

  private setupTray() {
    this.tray = new Tray(this.trayIcon);
    this.tray.on('click', this.togglePopoverWindow.bind(this));
    this.tray.on('right-click', this.showQuitMenu.bind(this));
  }

  private setupPopoverWindowOptions() {
    this.popoverWindow.setMovable(false);
    this.popoverWindow.setMinimizable(false);
    this.popoverWindow.setMaximizable(false);
    this.popoverWindow.setClosable(false);
    this.popoverWindow.setAlwaysOnTop(true);
    this.popoverWindow.setFullScreen(false);
    this.popoverWindow.setFullScreenable(false);
    this.popoverWindow.setSkipTaskbar(true);
    this.popoverWindow.on('blur', this.hidePopoverWindow.bind(this));
  }

  private togglePopoverWindow() {
    if (this.popoverWindow.isVisible()) {
      this.hidePopoverWindow();
    } else {
      this.showPopoverWindow();
    }
  }

  private showPopoverWindow() {
    // // calc popover window position
    const windowBounds = this.popoverWindow.getBounds();
    const trayBounds = this.tray.getBounds();

    const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
    const y = Math.round(trayBounds.y + trayBounds.height);

    // set postion and show popover window
    this.popoverWindow.setPosition(x, y, false);
    this.popoverWindow.show();
    this.popoverWindow.focus();
  }

  private hidePopoverWindow() {
    this.popoverWindow.hide();
  }

  private showQuitMenu() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => {
          this.destroy();
          app.quit();
        },
      },
    ]);
    this.tray.popUpContextMenu(contextMenu);
  }

  destroy() {
    this.tray.destroy();
  }
}
