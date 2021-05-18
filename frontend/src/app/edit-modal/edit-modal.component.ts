import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Todo } from '../models/Todos';
import { DataserviceService } from '../services/dataservice.service';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {
  @Input() todo!:any;
  @Input() index!:number;
  @Output() emitService = new EventEmitter();
  constructor(public activeModal: NgbActiveModal,private _dataservice:DataserviceService) {}
  public content!:string;
  ngOnInit(): void {
    this.content = this.todo.Content;
  }
  addMe() {
    this.emitService.next("Hello from modal");
}
//test perpose add
  updateTodo(){
    const updatedTodo = {...this.todo};
    updatedTodo.Content = this.content;
    this._dataservice.updateTodo(updatedTodo)
        .subscribe(
          response =>console.log('Success!',response),
          error => console.log('error',error)
        );
  }
}
