import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlayerChoicePage } from './player-choice.page';

describe('PlayerChoicePage', () => {
  let component: PlayerChoicePage;
  let fixture: ComponentFixture<PlayerChoicePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [PlayerChoicePage],
    imports: [IonicModule.forRoot()],
    teardown: { destroyAfterEach: false }
}).compileComponents();

    fixture = TestBed.createComponent(PlayerChoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
