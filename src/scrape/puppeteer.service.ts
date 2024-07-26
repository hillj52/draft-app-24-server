import { Injectable, Logger } from "@nestjs/common";
import puppeteer, { Browser, Page } from "puppeteer";

@Injectable()
export class PuppeteerService {
  private readonly logger = new Logger(PuppeteerService.name);
  private browser: Browser;
  private pages: Map<String, Page> = new Map();

  async openPage(url: string, name: string) {
    const page = await this.browser.newPage();
    try {
      await page.goto(url);
    } catch (err) {
      this.logger.error(`Error navigating to page ${url}:`, err);
      throw new Error(err);
    }
    this.pages.set(name, page);
  }

  async closePage(name: string) {
    if (this.pages.has(name)) {
      await this.pages.get(name).close();
      return this.pages.delete(name);
    }
    return false;
  }

  getPage(name: string) {
    return this.pages.get(name);
  }

  async openBrowser() {
    this.browser = await puppeteer.launch();
  }

  async closeBrowser() {
    this.pages.clear();
    await this.browser.close();
  }
}