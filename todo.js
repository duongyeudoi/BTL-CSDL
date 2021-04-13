onload = todoMain;

function todoMain(){
  let inputElem,
      inputElem2,
      inputElem3,
      startInput,
      endInput,
      button,
      changeBtn,
      searchBtn,
      todoTable ,
      todoList = [],
      calendar;


  getElements();
  addListeners();
  initCalendar();
  load();
  renderRows();

  function getElements(){
    inputElem = document.getElementsByTagName("input")[0];
    inputElem2 = document.getElementsByTagName("input")[1];
    inputElem3 = document.getElementsByTagName("input")[2];
    startInput = document.getElementById('startInput');
    endInput = document.getElementById('endInput');
    button = document.getElementById("addBtn");
    changeBtn = document.getElementById('changeBtn');
    todoTable = document.getElementById('todoTable');
    searchBtn = document.getElementById('searchBtn');
  }

  function addListeners(){
    button.addEventListener("click", addEntry, false);

    //event delegation
    // document.addEventListener("click", showModalBox, false);


    // document.getElementById('todoTable').addEventListener("click", onTableClicked, false);
    document.getElementById('todo-modal-close-btn').addEventListener("click", closeEditModalBox, false);

    changeBtn.addEventListener("click", commitEdit, false);
    // searchBtn.addEventListener("click", searchSub, false)
    
    



  }

  function dayofWeek(day) {
    if(day ==="Thứ hai") return 1;
    if(day ==="Thứ ba") return 2;
    if(day ==="Thứ tư") return 3;
    if(day ==="Thứ năm") return 4;
    if(day ==="Thứ sáu") return 5;
    if(day ==="Thứ bảy") return 6;
    if(day ==="Chủ nhật") return 0;
    
    

  }

  function addEntry(event){

    let inputValue = inputElem.value;
    inputElem.value = "";

    let inputValue2 = inputElem2.value;
    inputElem2.value = "";

    let inputValue3 = inputElem3.value;
    inputElem3.value = "";


// add time
    let startValue = startInput.value;
    startInput.value = "";

    let endValue = endInput.value;
    endInput.value = "";

    
    let obj = {
      id: _uuid(),
      todo: inputValue,
      day: inputValue2,
      location: inputValue3,
      startTime: startValue,
      endTime: endValue,
      done: false,  
    }

    renderRow(obj);
   

    todoList.push(obj);
    save();


    
   

  }

  function save() {
    let stringified = JSON.stringify(todoList);
    localStorage.setItem("todoList", stringified);

  }

  function load() {
    let retrieved = localStorage.getItem("todoList");
    todoList = JSON.parse(retrieved);
    if (todoList == null) {
      todoList = [];
    }
    console.log(todoList);
  }

  function renderRows() {
    todoList.forEach( todoObj => {
      renderRow(todoObj);
    })

    // draw(todoList.map(obj => {
    //   return{
    //     title: obj.todo,
    //     startTime: obj.startTime,
    //     endTime: obj.endTime,
    //     daysOfWeek: [dayofWeek(obj.day)],

    //   }
    // }))
    

  }

  function renderRow({todo: inputValue, day: inputValue2, location: inputValue3, id, startTime: startTime, endTime: endTime, done}) {
     // add a new row

     let table = document.getElementById("todoTable");

     let trElem = document.createElement("tr");
     table.appendChild(trElem);
 
     // checkbox cell
     let checkboxElem = document.createElement("input");
     checkboxElem.type = "checkbox";
     checkboxElem.addEventListener("click", checkboxClickCallback, false);
     checkboxElem.dataset.id = id;
     let tdElem1 = document.createElement("td");
     tdElem1.appendChild(checkboxElem);
     trElem.appendChild(tdElem1);

  

 
     // to-do cell
     let tdElem2 = document.createElement("td");
     tdElem2.innerText = inputValue;
     trElem.appendChild(tdElem2);



     //location cell
     let tdElem5 = document.createElement("td");
     tdElem5.innerText = inputValue3;
     trElem.appendChild(tdElem5);

        //time cell
        let timeElem = document.createElement('td');
        timeElem.innerText = startTime + ' - ' + endTime;
        trElem.appendChild(timeElem);
 
     // category cell
     let tdElem3 = document.createElement("td");
     tdElem3.innerText = inputValue2;
     trElem.appendChild(tdElem3);

     //edit cell
     let editSpan = document.createElement("span");
     editSpan.innerText = "edit";
     editSpan.className = "material-icons";
     editSpan.addEventListener("click", editItem, false);
     editSpan.dataset.id = id;

     let editTd = document.createElement("td");
     editTd.appendChild(editSpan);
     trElem.appendChild(editTd);


     // delete cell
     let spanElem = document.createElement("span");
     spanElem.innerText = "delete";
     spanElem.className = "material-icons";
     spanElem.addEventListener("click", deleteItem, false);
     spanElem.dataset.id = id;

     let tdElem4 = document.createElement("td");
     tdElem4.appendChild(spanElem);
     trElem.appendChild(tdElem4);

 
    

     let titleTest = inputValue + '\n' + inputValue3;

     this.checked = done;
     if(done) {
      trElem.classList.add("strike");

     } else {
      trElem.classList.remove("strike");
     }


     addEvent({
       id: id,
      title: titleTest,
      startTime: startTime,
      endTime: endTime,
      daysOfWeek: [dayofWeek(inputValue2)],
    }); 

    
    tdElem2.dataset.type = "todo";
    tdElem3.dataset.type = "day";
    tdElem5.dataset.type = 'location';



    timeElem.dataset.id = id;
    tdElem2.dataset.id = id;
    tdElem3.dataset.id = id;
    tdElem5.dataset.id = id;




  

     

     function deleteItem(){
      trElem.remove();
      for(let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id) {
          todoList.splice(i, 1);
        } 
      }
      save();

      //remove from calendar
      calendar.getEventById( this.dataset.id).remove();


    }

    function checkboxClickCallback(){
      trElem.classList.toggle("strike");
      for(let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id) {
          todoList[i]["done"] = this.checked;
        } 
      }
      save();
        
    }

    function allowEdit(event) {
      let currentText = event.target.innerText;
      event.target.innerText = "";

      let tempTextbox = document.createElement("input");

      event.target.appendChild(tempTextbox);

      tempTextbox.value = currentText;
      tempTextbox.addEventListener('change', onChange, false);

      function onChange(event) {
        let changedValue = event.target.value;
        let id = event.target.parentNode.dataset.id;
        // console.log(event.target.parentNode.dataset.id);
         //remove from calendar
      calendar.getEventById(id).remove();

         
        todoList.forEach( todoObj => {
          if(todoObj.id == id) {
            todoObj.todo = changedValue;
            titleTest = changedValue +  '\n' + inputValue3;
            addEvent({
              id: id,
             title: titleTest,
             startTime: startTime,
             endTime: endTime,
             daysOfWeek: [dayofWeek(inputValue2)],
           }); 
          }
        });

        save();

      } 

    }


  }
    function _uuid() {
      var d = Date.now();
      if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }
  
    function initCalendar() {
      var calendarEl = document.getElementById('calendar');
  
     calendar = new FullCalendar.Calendar(calendarEl, {
      height: 'auto',
      width: 'auto',
      contentHeight: 'auto',
      headerToolbar: false,
      eventDisplay: 'block',
      firstDay: 1,
      slotDuration: '00:60:01',
      displayEventTime: false,
      // slotLabelInterval: '00:10:00',
      allDaySlot: false,
      slotMinTime: '07:00:00',
      slotMaxTime: '20:50:00',
      // dayHeaders: false,
      // titleFormat: 'dddd',
  
       initialView: 'timeGridWeek',
      // headerToolbar: {
      //   left: 'prev,next today',
      //   right: 'dayGridMonth,timeGridWeek,timeGridDay'
      // },
      
      dayHeaderFormat: {
        weekday: 'long',
      },
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: true,
      },
  
      events: [],
      eventBackgroundColor: "#a11e12",
      eventBorderColor: "#ed6a5e",
      
      eventClick: function(info) {
        editItem( );
        // alert('Event: ' + info.event.title);
        // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
        // alert('View: ' + info.view.type);
    
        // // change the border color just for fun
        // info.el.style.borderColor = 'red';
      }
    });
  
    calendar.render();
 }

 function addEvent(event) {
   calendar.addEvent(event);
 }

 function onTableClicked(event) {
   if(event.target.matches('td') && event.target.dataset.editable == 'true') {
     switch(event.target.dataset.type) {

     }
   }



 }

 function showModalBox(event) {
   document.getElementById('todo-overlay').classList.add('slideIntoView');

 }

 function closeEditModalBox(event) {
  document.getElementById('todo-overlay').classList.remove('slideIntoView');


 }

 function commitEdit(event) {
   closeEditModalBox();
   let id = event.target.dataset.id;

   let todo = document.getElementById('todo-edit-todo').value;
   let day = document.getElementById('todo-edit-category').value;
   let location = document.getElementById('todo-edit-location').value;
   let startTime = document.getElementById('todo-edit-start').value;
   let endTime = document.getElementById('todo-edit-end').value;

  //remove from calendar
  calendar.getEventById(id).remove();

  //  todoList.forEach(todoObj => {
  //    if(todoObj.id == id) {

  //     todoObj = {
  //       id,
  //       todo,
  //       day,
  //       location,
  //       startTime,
  //       endTime
  //     };

  //     console.log(todo);


     
      
  //       addEvent({
  //         id: id,
  //        title: todoObj.todo + '\n' + todoObj.location,
  //        startTime: todoObj.startTime,
  //        endTime: todoObj.endTime,
  //        daysOfWeek: [dayofWeek(todoObj.day)],
  //      }); 
      

  //    }
  //  });

   for (let i = 0; i < todoList.length; i++) {
     if(todoList[i].id == id) {
       todoList[i] = {
         id : id,
         todo: todo,
         day: day,
         location: location,
         startTime: startTime,
         endTime: endTime
       };

       addEvent({
        id: id,
       title: todoList[i].todo + '\n' + todoList[i].location,
       startTime: todoList[i].startTime,
       endTime: todoList[i].endTime,
       daysOfWeek: [dayofWeek(todoList[i].day)],
     }); 

     }
   }

   save();


   //update the table
   let tdNodeList = todoTable.querySelectorAll('td');
   
   for(let j = 0; j < tdNodeList.length; j++) {
     if(tdNodeList[j].dataset.id == id) {
       let type = tdNodeList[j].dataset.type;
       switch(type) {
         case 'todo' :
           tdNodeList[j].innerText = todo;
           break;
         case 'day' :
          tdNodeList[j].innerText = day;
          break;
         case 'location' :
          tdNodeList[j].innerText = location;
          break;



       }
     }
   }
 }

 function editItem(event) {
  showModalBox();
  let id;

  if(event.target) {
    id = event.target.dataset.id;


  }
  else {
    id = event.id;
  }

  preFillEditForm(id);
  
 


}

function preFillEditForm(id) {
   let result = todoList.find(todoObj => todoObj.id == id);

  let {todo, day, location, startTime, endTime} = result;
  document.getElementById('todo-edit-todo').value = todo;
  document.getElementById('todo-edit-category').value = day;
  document.getElementById('todo-edit-location').value = location;
  document.getElementById('todo-edit-start').value = startTime;
  document.getElementById('todo-edit-end').value = endTime;

  changeBtn.dataset.id = id;


}




  
  

}
  

