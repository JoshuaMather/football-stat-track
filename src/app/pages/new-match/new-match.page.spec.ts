import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewMatchPage } from './new-match.page';

describe('NewMatchPage', () => {
  let component: NewMatchPage;
  let fixture: ComponentFixture<NewMatchPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [NewMatchPage],
    imports: [IonicModule.forRoot()],
    teardown: { destroyAfterEach: false }
}).compileComponents();

    fixture = TestBed.createComponent(NewMatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
