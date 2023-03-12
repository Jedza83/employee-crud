window.onload = function () {
  loadDataFromFirebase2();
};

var selectedRow = null;
function onFormSubmit2() {
  const formData = readFormData2();
  if (validate2(formData)) {
    saveDataToFirebase2(formData);
    if (!selectedRow) {
      insertNewRecord2(formData);
    } else {
      updateRecord2(formData);
    }
    resetForm2();
  }
}
///
function readFormData2() {
  var formData2 = {};
  formData2["name"] = document.getElementById("name").value;
  formData2["start"] = document.getElementById("start").value;
  formData2["end"] = document.getElementById("end").value;
  return formData2;
}
///
function validate2() {
  isValid = true;
  if (document.getElementById("name").value == "") {
    isValid = false;
    document.getElementById("nameValidationError").classList.remove("hide");
  } else {
    isValid = true;
    if (
      !document.getElementById("nameValidationError").classList.contains("hide")
    )
      document.getElementById("nameValidationError").classList.add("hide");
  }
  return isValid;
}
document
  .getElementById("holidaysForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    onFormSubmit2();
  });

function saveDataToFirebase2(formData) {
  db.collection("holidays")
    .add(formData)
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      window.location.reload();
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

///////////////////
function insertNewRecord2(data) {
  // Creating table
  var table = document
    .getElementById("holidaysList")
    .getElementsByTagName("tbody")[0];
  var newRow = table.insertRow(table.length);
  newRow.setAttribute("data-table-id", +data.id);
  // Inserting data in rows
  cell1 = newRow.insertCell(0);
  cell1.innerHTML = data.name;
  cell2 = newRow.insertCell(1);
  cell2.innerHTML = data.start;
  cell3 = newRow.insertCell(2);
  cell3.innerHTML = data.end;
  cell4 = newRow.insertCell(3);
  cell4.innerHTML = `<a onClick="onEdit2(this)">Edit</a>
                         <a onClick="onDelete2(this)">Delete</a>`;
}
//////
function updateRecord2(formData) {
  selectedRow.cells[0].innerHTML = formData.name;
  selectedRow.cells[1].innerHTML = formData.start;
  selectedRow.cells[2].innerHTML = formData.end;
}
//////
function resetForm2() {
  document.getElementById("name").value = "";
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
  selectedRow = null;
}
function onDelete2(td) {
  if (confirm("Are you sure to delete this data?")) {
    const row = td.parentElement.parentElement;
    const dataId = row.getAttribute("data-table-id");

    db.collection("holidays")
      .doc(dataId)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");

        row.remove();
        resetForm2();
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  }
}

function onEdit2(td) {
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
      rowData["name"] = cells[0].innerHTML;
      rowData["start"] = cells[1].innerHTML;
      rowData["end"] = cells[2].innerHTML;

      db.collection("holidays")
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
function loadDataFromFirebase2() {
  var table = document
    .getElementById("holidaysList")
    .getElementsByTagName("tbody")[0];
  firebase
    .firestore()
    .collection("holidays")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var newRow = table.insertRow(table.length);
        newRow.setAttribute("data-table-id", doc.id);
        var cell1 = newRow.insertCell(0);
        cell1.innerHTML = doc.data().name;
        var cell2 = newRow.insertCell(1);
        cell2.innerHTML = doc.data().start;
        var cell3 = newRow.insertCell(2);
        cell3.innerHTML = doc.data().end;
        var cell4 = newRow.insertCell(3);
        cell4.innerHTML = `<a onClick="onEdit2(this)">Edit</a>
                              <a onClick="onDelete2(this)">Delete</a>`;
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}
///////////////-------------Who goes to vacation first (functionality)--------------//////////////////////////
function closestHoliday() {
  const now = new Date();
  const resVac = document.getElementById("resVac");

  db.collection("holidays")
    .get()
    .then((querySnapshot) => {
      let closestHoliday = { date: null, name: null };
      querySnapshot.forEach((doc) => {
        const holidayDate = new Date(
          doc.data().start.split(".").reverse().join("-")
        );
        if (
          holidayDate >= now &&
          (closestHoliday.date === null || holidayDate < closestHoliday.date)
        ) {
          closestHoliday = { date: holidayDate, name: doc.data().name };
        }
      });
      if (closestHoliday.name !== null) {
        resVac.innerHTML = `Employee who goes to vacation first is: ${closestHoliday.name}`;
      } else {
        resVac.innerHTML = "There is no employee who goes to vacation soon..";
      }
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
}
