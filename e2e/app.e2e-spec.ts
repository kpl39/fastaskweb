import { FastaskwebPage } from './app.po';

describe('fastaskweb App', () => {
  let page: FastaskwebPage;

  beforeEach(() => {
    page = new FastaskwebPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
