import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { routes } from './app.routes';
import { ActivatedRoute, provideRouter } from '@angular/router';

export const FAKE_ROUTE = {
  snapshot: { paramMap: {get: () => 'order'}}
};

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers:[{provide: ActivatedRoute, useValue: FAKE_ROUTE},provideRouter(routes)]
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  
});
