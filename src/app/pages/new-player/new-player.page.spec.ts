import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewPlayerPage } from './new-player.page';

describe('NewPlayerPage', () => {
  let component: NewPlayerPage;
  let fixture: ComponentFixture<NewPlayerPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [NewPlayerPage],
    imports: [IonicModule.forRoot()],
    teardown: { destroyAfterEach: false }
}).compileComponents();

    fixture = TestBed.createComponent(NewPlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
