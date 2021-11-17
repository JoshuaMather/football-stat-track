import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlayerStatsPage } from './player-stats.page';

describe('PlayerStatsPage', () => {
  let component: PlayerStatsPage;
  let fixture: ComponentFixture<PlayerStatsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [PlayerStatsPage],
    imports: [IonicModule.forRoot()],
    teardown: { destroyAfterEach: false }
}).compileComponents();

    fixture = TestBed.createComponent(PlayerStatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
