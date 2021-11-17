import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-new-player',
  templateUrl: './new-player.page.html',
  styleUrls: ['./new-player.page.scss'],
})
export class NewPlayerPage implements OnInit {

  public edit: boolean;
  public createPlayer: FormGroup;

  public dateValue = '';
  public today;

  public id;
  public name;
  public position;
  public dob;
  public email;
  public phoneNumber;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private db: DbService,
    private route: ActivatedRoute,
  ) {
      this.createPlayer = this.formBuilder.group({
        // Validators.required
        name: ['', Validators.required],
        position: [''],
        email: [''],
        phone: [''],
        dob: [''],
      });
  }

  async ngOnInit() {
    this.edit=false;
    this.createPlayer.reset();
    const date = new Date();
    this.today = date.toISOString();

    await this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.name = params.name;
      this.position = params.position;
      this.dob = params.dob;
      this.email = params.email;
      this.phoneNumber = params.phoneNumber;
      if(this.id) {
        this.edit = true;
      }
    });
    console.log(this.id, this.name, this.position, this.dob, this.email, this.phoneNumber);
  }

  onCreatePlayer() {
    if(this.createPlayer.get('name').value) {
      this.name = this.createPlayer.get('name').value;
    }
    if(this.createPlayer.get('position').value) {
      this.position = this.createPlayer.get('position').value;
    }
    if(this.dateValue) {
      this.dob = this.dateValue;
    }
    if(this.createPlayer.get('email').value) {
      this.email = this.createPlayer.get('email').value;
    }
    if(this.createPlayer.get('phone').value) {
      this.phoneNumber = this.createPlayer.get('phone').value;
    }


    if(this.edit===true){
      this.db.updatePlayer(
        this.id,
        this.name,
        this.position,
        this.dob,
        this.email,
        this.phoneNumber,
      );
    } else {
      this.db.addPlayer(
        this.name,
        this.position,
        this.dob,
        this.email,
        this.phoneNumber,
      );
    }
  }

  formatDate(value: string) {
    return format(parseISO(value), 'MMM dd yyyy');
  }

}
