import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('NICE inContact CXone Authenticate application', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display sign-in header', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Sign In');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    }));
  });
});
