import { Component,OnInit } from '@angular/core';
import { AppService} from './app.service';
import handsontable from 'handsontable';
handsontable.DefaultSettings

type SortOrderType = 'asc'| 'desc';
class ConfigVO {
  column: number=0;
  sortOrder:SortOrderType='asc'; 
}
class ColumnSortingVO {
  sortEmptyCells?:boolean;
  initialConfig:ConfigVO[]|ConfigVO= new ConfigVO();
  indicator?:boolean;
  headerAction?:boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'invisiblegrid';
  dataset:any=[]; 
  configWidth =[100,200,100,100];
  manualColumnResize:boolean|Array<number>=true;
  column=[ 
    { data: 0 },
    { data: 1 },
    { data: 2 },
    { data: 3 },
  ];
  multi:ColumnSortingVO|boolean =true;
  manualColumnMove:boolean|Array<number>=true;
  constructor(private appSrv:AppService){
    // let configColWidth = localStorage.getItem('configColWidth') ||"[]";
    // let configColWidth1 = [... JSON.parse(configColWidth)];
    // this.configWidth = configColWidth1;
    ['manualColumnMove','manualColumnWidths','columnSorting'].forEach((key)=>{
      
      let config = localStorage.getItem(key)|| "true";
      switch(key){
        case 'columnSorting':
          this.multi = JSON.parse(config);
          break;
        case 'manualColumnMove':
            let columnSort = JSON.parse(config);
            let columnSortR:Array<{data:number}> =[];
            if(columnSort != true){
              columnSort.forEach((col:number,i:number) => {
                columnSortR.push({data:col});
              });
              this.manualColumnMove = true;//columnSort;
              this.column = columnSortR;
              localStorage.setItem("columnVar",JSON.stringify(columnSortR));
              console.log(columnSortR)
            }
            
          break;
        case 'manualColumnWidths':
            this.manualColumnResize = JSON.parse(config);
            if(this.manualColumnResize != true){
              this.configWidth =this.manualColumnResize as number[];
            }
          break;
      }
      // console.log(key);
      // console.log(config);
      // console.log(this.multi);
    })
  
  }
  ngOnInit(){
    this.appSrv.readCsvData().subscribe(
      ( data: any) => { this.dataset =this.appSrv.extractData(data);},
      ( err: any) => this.appSrv.handleError(err)
    );
  }
  // sorted(currentSortConfig:any, destinationSortConfigs:any){
  //   console.log(currentSortConfig);
  //   console.log(destinationSortConfigs);
  // }
  // changed(newSize:any,column:any,isDoubleClick:any){
  //   // console.log(newSize);
  //   // console.log(column);
  //   // let configColWidth = localStorage.getItem('configColWidth') ||"[]";
  //   // let configColWidth1 = [... JSON.parse(configColWidth)];
  //   // configColWidth1[column] =newSize ;
  //   // localStorage.setItem('configColWidth', JSON.stringify(configColWidth1));
  // }
  // compareFunctionFactory(sortOrder:any, columnMeta:any) {
  //   return function comparator(value:any, nextValue:any) {
  //     return 1;
  //   };
  // };
  // afterColumnMove(movedColumns:any, finalIndex:any, dropIndex:any, movePossible:any, orderChanged:any){
  //   console.log(movedColumns);
  //   console.log(finalIndex);
  //   console.log(dropIndex);
  //   console.log(movePossible);
  //   console.log(orderChanged);
  // }
  persistentStateLoad(key:any,value:any){
    let config = localStorage.getItem(key)|| "true";
    switch(key){
      case 'columnSorting':
        this.multi = JSON.parse(config);
        break;
      case 'manualColumnMove':
          this.manualColumnMove = JSON.parse(config);
        break;
      case 'manualColumnWidths':
          this.manualColumnResize = JSON.parse(config);
          if(this.manualColumnResize != true){
            this.configWidth =this.manualColumnResize as number[];
          }
        break;
    }
   
  }
  persistentStateReset(){
    console.log("fas")
  }
  persistentStateSave(key:any,value:any){
    console.log(key)
    console.log(value)
    let persistentStateKeys = localStorage.getItem('persistentStateKeys')|| "[]";
    let persistentStateValue = JSON.parse(persistentStateKeys);
    if(!persistentStateValue.includes(key)){
      persistentStateValue.push(key);
    }
    localStorage.setItem('persistentStateKeys',JSON.stringify(persistentStateValue));
    if(key =='manualColumnMove'){
      let sortValue: number[] = [];
      let columnStr = localStorage.getItem('columnVar')|| "[]"
      let column = JSON.parse(columnStr);
      if(column.length == 0){
        column= [ 
          { data: 0 },
          { data: 1 },
          { data: 2 },
          { data: 3 },
        ]
      }
      value.forEach((element:number,i:number) => {
        sortValue.push(column[element].data)
      });
      value = sortValue;
    }
    console.log(value)
    localStorage.setItem(key,JSON.stringify(value));
  }
}
