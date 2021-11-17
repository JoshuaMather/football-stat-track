import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MatchStatsPage } from './match-stats.page';

describe('MatchStatsPage', () => {
  let component: MatchStatsPage;
  let fixture: ComponentFixture<MatchStatsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [MatchStatsPage],
    imports: [IonicModule.forRoot()],
    teardown: { destroyAfterEach: false }
}).compileComponents();

    fixture = TestBed.createComponent(MatchStatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
