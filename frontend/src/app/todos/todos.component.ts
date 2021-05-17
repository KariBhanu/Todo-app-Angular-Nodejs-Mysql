import { Component, NgModuleRef, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Todo } from '../models/Todos';
import { DataserviceService } from '../services/dataservice.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit{

  todos:any;
  inputTodo:string = "";
  constructor(private _dataservice: DataserviceService,private _modalService: NgbModal) { }

  
  ngOnInit(){
   // this.todos=this._dataservice.getAlltodos(); 
   this.retriveTodos();
  }
  retriveTodos(){
    this._dataservice.getAlltodos()
        .subscribe( (data:Todo) => {
          this.todos = data;
          console.log(this.todos)
        },
        error =>{
            console.log(error);
        });
    //this._dataservice.getAlltodos();
  }
  toggleDone(todo:any){
    const updatedTodo = todo;
    if(updatedTodo.Completed == 0){
      updatedTodo.Completed = true;
    }
    else {
      updatedTodo.Completed = false;
    }
    //setTimeout(()=>{
      let updatingTodo = new Promise((resolve,reject)=>{
        this._dataservice.updateTodo(updatedTodo)
          .subscribe(
            response =>{console.log('Success!',response);return resolve(response)},
            error => {console.log('error',error);return reject(error);}
          ); });
        //   setTimeout(()=>{
        //     this.retriveTodos();
        // },200);
        updatingTodo.then(()=>{
          this.retriveTodos();
        });
        updatingTodo.catch((error)=>{
          console.log("Error occured while deleting the data");
        });
    //},200);
    // this.todos.map((v:any,i:any)=>{
    //   if(i===id) {
    //     //v.completed = !v.completed;
    //     if(v.Completed === 0){
    //       v.Completed = 1;
    //     }
    //     else if(v.Completed === 1){
    //       v.Completed = 0;
    //     }
    //   }
    //   return v;
    // })
  }
  deleteTodo(id:number){
    //this.todos = this.todos.filter((v,i)=>i!=id);
    let deletingTodo = new Promise((resolve,reject)=>{ 
      this._dataservice.deleteTodo(id)
        .subscribe(
          response =>{console.log('Success!',response);return resolve(response)},
          error => {console.log('error',error);return reject(error);}
        );
      });
      //   setTimeout(()=>{
      //     this.retriveTodos();
      // },200);
      deletingTodo.then(()=>{
        this.retriveTodos();
      });
      deletingTodo.catch((error)=>{
        console.log("Error occured while deleting the data");
      });
      
  }
  addTodo(){
    let length = Object.keys(this.todos).length + 1;
   
    let todo = {
      "ID" : length,
      "Content" : this.inputTodo,
      "Completed" : false
    }
    console.log(todo);
    //let todo = new Todo(this.length.toString(),this.inputTodo,completed.toString());
    
    let addingTodo = new Promise((resolve,reject)=>{
      this._dataservice.addTodo(todo)
        .subscribe(
          // response =>console.log('Success!',response),
          // error => console.log('error',error)
          response => resolve(response),
          error => reject(error)
        );
      })
        
    //this._dataservice.addTodo(this.inputTodo);
    this.inputTodo = "";
  //   setTimeout(()=>{
  //     this.retriveTodos();
  // },200);
  addingTodo.then((response)=>{
    console.log('Success!',response);
    this.retriveTodos();
  })
  addingTodo.catch((error)=>{
    console.log('Success!',error);
  })
    
  }
  
  open(todo:Todo) {
    const index = this.todos.indexOf(todo);
    const modalRef = this._modalService.open(EditModalComponent);
    modalRef.componentInstance.todo = todo;
    modalRef.componentInstance.index = index;
    modalRef.componentInstance.emitService.subscribe((emitedValue: any) => {
      setTimeout(()=>{
        this.retriveTodos();
    },200);
  })
  }

 

}
