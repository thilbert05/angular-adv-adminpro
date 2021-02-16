import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkEl = document.querySelector('#theme');

  constructor() {
    const url = localStorage.getItem('theme') || 'assets/css/colors/default.css';
    this.linkEl.setAttribute('href', url);
  }

  changeTheme(theme: string) {
    const url = `assets/css/colors/${theme}.css`;
    this.linkEl.setAttribute('href', url);
    localStorage.setItem('theme', url);
    this.checkCurrentTheme();
  }

  checkCurrentTheme() {
    const links: NodeListOf<Element> = document.querySelectorAll('.selector');

    links.forEach(link => {
      link.classList.remove('working');
      const btnTheme = link.getAttribute('data-theme');
      const btnThemeUrl = `assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkEl.getAttribute('href');
      if (btnThemeUrl === currentTheme) {
        link.classList.add('working');
      }
    });
  }
}
