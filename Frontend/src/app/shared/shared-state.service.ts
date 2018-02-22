import { Injectable } from '@angular/core';

@Injectable()
export class SharedStateService {

  constructor() { }

  public navRoutes: Object[] = [
    { path: '/home', title: 'Home' },
    { path: '/Portfolio', title: 'Portfolios' },
    { path: 'PropertyTypes', title: 'PropertyTypes' },
    { path: 'Security', title: 'Securities' },
    { path: 'PortfolioGroup', title: 'Portfolio Groups' },
    { path: 'ReferencePortfolio', title: 'Reference Portfolio' }

  ];

}
