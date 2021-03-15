import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css']
})
export class TrashComponent implements OnInit {
  deletedData:any;
  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getDeletedData();
  }

  getDeletedData(){
    this.commonService.get(`getDeletedData`).subscribe((data: any)=>{
      if(data.status==200){
        console.log("........",data.data)
      this.deletedData=data.data.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      console.log(this.deletedData)

      }else{
        this.deletedData=[]
      }
    
  })
  


}

restoresubject(id){
  let body={
    subjectId:id
  }
  this.commonService.post('restoreSubject',body).subscribe((data: any)=>{
    console.log(data.status)
    if(data && data.status==200){
      this.getDeletedData();
    }else{
      
    }
  })
}
restorNote(id){
  let body={
    notesId:id
  }
  this.commonService.post('restoreNote',body).subscribe((data: any)=>{
    if(data && data.status==200){
      this.getDeletedData();
    }else{

    }
  })

}
private checkKey(data,key: string) {
  // console.log(data,key)
  return(data.hasOwnProperty(key))
 // this.mapToSearch[newKey] = newValue;
}

}
