window.onload = function () {
  loadDataFromFirebase1();
};

var selectedRow = null;
function onFormSubmit1() {
  const formData = readFormData1();
  if (validate1(formData)) {
    saveDataToFirebase1(formData);
    if (!selectedRow) {
      insertNewRecord1(formData);
    } else {
      updateRecord1(formData);
    }
    resetForm1();
  }
}
///
function readFormData1() {
  var formData1 = {};
  formData1["title"] = document.getElementById("title").value;
  formData1["description"] = document.getElementById("description").value;
  formData1["assignee"] = document.getElementById("assignee").value;
  formData1["duedate"] = document.getElementById("duedate").value;
  return formData1;
}
///
function validate1() {
  isValid = true;
  if (document.getElementById("title").value == "") {
    isValid = false;
    document.getElementById("titleValidationError").classList.remove("hide");
  } else {
    isValid = true;
    if (
      !document
        .getElementById("titleValidationError")
        .classList.contains("hide")
    )
      document.getElementById("titleValidationError").classList.add("hide");
  }
  return isValid;
}
document.getElementById("tasksForm").addEventListener("submit", function (e) {
  e.preventDefault();
  onFormSubmit1();
});

function saveDataToFirebase1(formData) {
  db.collection("tasks")
    .add(formData)
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      window.location.reload();
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

///////
function insertNewRecord1(data) {
  // Format date "dd.mm.yyyy"
  const date = new Date(data.duedate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const formattedDate = `${day}.${month}.${year}`;

  // Create table
  var table = document
    .getElementById("tasksList")
    .getElementsByTagName("tbody")[0];
  var newRow = table.insertRow(table.length);
  newRow.setAttribute("data-table-id", +data.id);

  // insert data to rows
  cell1 = newRow.insertCell(0);
  cell1.innerHTML = data.title;
  cell2 = newRow.insertCell(1);
  cell2.innerHTML = data.description;
  cell3 = newRow.insertCell(2);
  cell3.innerHTML = data.assignee;
  cell4 = newRow.insertCell(3);
  cell4.innerHTML = formattedDate;
  cell5 = newRow.insertCell(4);
  cell5.innerHTML = `<a onClick="onEdit1(this)">Edit</a>
                       <a onClick="onDelete1(this)">Delete</a>`;
}

//////
function updateRecord1(formData) {
  selectedRow.cells[0].innerHTML = formData.title;
  selectedRow.cells[1].innerHTML = formData.description;
  selectedRow.cells[2].innerHTML = formData.assignee;
  selectedRow.cells[3].innerHTML = formData.duedate;
}
//////
function resetForm1() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("assignee").value = "";
  document.getElementById("duedate").value = "";
  selectedRow = null;
}
function onDelete1(td) {
  if (confirm("Are you sure to delete this data?")) {
    const row = td.parentElement.parentElement;
    const dataId = row.getAttribute("data-table-id");

    db.collection("tasks")
      .doc(dataId)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");

        row.remove();
        resetForm1();
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  }
}

function onEdit1(td) {
  selectedRow = td.parentElement.parentElement;
  let cells = selectedRow.cells;
  for (let i = 0; i < cells.length - 1; i++) {
    let cell = cells[i];
    let oldData = cell.innerHTML;
    let newData = prompt("Enter new data", oldData);

    if (newData != null && newData != "") {
      cell.innerHTML = newData;

      // Update the data in Firebase
      let rowData = {};
      rowData["title"] = cells[0].innerHTML;
      rowData["description"] = cells[1].innerHTML;
      rowData["assignee"] = cells[2].innerHTML;
      rowData["duedate"] = cells[3].innerHTML;
      db.collection("tasks")
        .doc(selectedRow.dataset.tableId)
        .update(rowData)
        .then(function () {
          console.log("Document successfully updated!");
        })
        .catch(function (error) {
          console.error("Error updating document: ", error);
        });
    } else {
      cell.innerHTML = oldData;
    }
  }
}
//////
function loadDataFromFirebase1() {
  var table = document
    .getElementById("tasksList")
    .getElementsByTagName("tbody")[0];
  firebase
    .firestore()
    .collection("tasks")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var newRow = table.insertRow(table.length);
        newRow.setAttribute("data-table-id", doc.id);
        var cell1 = newRow.insertCell(0);
        cell1.innerHTML = doc.data().title;
        var cell2 = newRow.insertCell(1);
        cell2.innerHTML = doc.data().description;
        var cell3 = newRow.insertCell(2);
        cell3.innerHTML = doc.data().assignee;
        var cell4 = newRow.insertCell(3);
        cell4.innerHTML = doc.data().duedate;
        var cell5 = newRow.insertCell(4);
        cell5.innerHTML = `<a onClick="onEdit1(this)">Edit</a>
                            <a onClick="onDelete1(this)">Delete</a>`;
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}
