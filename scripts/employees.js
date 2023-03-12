window.onload = function () {
  loadDataFromFirebase();
};

var selectedRow = null;
function onFormSubmit() {
  const formData = readFormData();
  if (validate(formData)) {
    saveDataToFirebase(formData);
    if (!selectedRow) {
      insertNewRecord(formData);
    } else {
      updateRecord(formData);
    }
    resetForm();
  }
}

function validate() {
  isValid = true;
  if (document.getElementById("fullName").value == "") {
    isValid = false;
    document.getElementById("fullNameValidationError").classList.remove("hide");
  } else {
    isValid = true;
    if (
      !document
        .getElementById("fullNameValidationError")
        .classList.contains("hide")
    )
      document.getElementById("fullNameValidationError").classList.add("hide");
  }
  return isValid;
}
document
  .getElementById("employeeForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    onFormSubmit();
  });

function readFormData() {
  var formData = {};
  formData["fullName"] = document.getElementById("fullName").value;
  formData["email"] = document.getElementById("email").value;
  formData["phonenumber"] = document.getElementById("phonenumber").value;
  formData["dateofbirth"] = document.getElementById("dateofbirth").value;
  formData["salary"] = document.getElementById("salary").value;
  return formData;
}

function insertNewRecord(data) {
  var table = document
    .getElementById("employeeList")
    .getElementsByTagName("tbody")[0];
  var newRow = table.insertRow(table.length);
  newRow.setAttribute("data-table-id", +data.id);
  cell1 = newRow.insertCell(0);
  cell1.innerHTML = data.fullName;
  cell2 = newRow.insertCell(1);
  cell2.innerHTML = data.email;
  cell3 = newRow.insertCell(2);
  cell3.innerHTML = data.phonenumber;
  cell4 = newRow.insertCell(3);
  cell4.innerHTML = data.dateofbirth;
  cell5 = newRow.insertCell(4);
  cell5.innerHTML = data.salary;
  cell6 = newRow.insertCell(5);
  cell6.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                           <a onClick="onDelete(this)">Delete</a>`;
}

function resetForm() {
  document.getElementById("fullName").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phonenumber").value = "";
  document.getElementById("dateofbirth").value = "";
  document.getElementById("salary").value = "";
  selectedRow = null;
}

function updateRecord(formData) {
  selectedRow.cells[0].innerHTML = formData.fullName;
  selectedRow.cells[1].innerHTML = formData.email;
  selectedRow.cells[2].innerHTML = formData.phonenumber;
  selectedRow.cells[3].innerHTML = formData.dateofbirth;
  selectedRow.cells[4].innerHTML = formData.salary;
}

function onDelete(td) {
  if (confirm("Are you sure to delete this data?")) {
    const row = td.parentElement.parentElement;
    const dataId = row.getAttribute("data-table-id");
    db.collection("employees")
      .doc(dataId)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
        row.remove();
        resetForm();
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  }
}

function onEdit(td) {
  selectedRow = td.parentElement.parentElement;
  let cells = selectedRow.cells;
  for (let i = 0; i < cells.length - 1; i++) {
    let cell = cells[i];
    let oldData = cell.innerHTML;
    let newData = prompt("Enter new data", oldData);
    if (newData != null && newData != "") {
      cell.innerHTML = newData;
      let rowData = {};
      rowData["fullName"] = cells[0].innerHTML;
      rowData["email"] = cells[1].innerHTML;
      rowData["phonenumber"] = cells[2].innerHTML;
      rowData["dateofbirth"] = cells[3].innerHTML;
      rowData["salary"] = cells[4].innerHTML;
      db.collection("employees")
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

function saveDataToFirebase(formData) {
  db.collection("employees")
    .add(formData)
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      window.location.reload();
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

function loadDataFromFirebase() {
  var table = document
    .getElementById("employeeList")
    .getElementsByTagName("tbody")[0];
  firebase
    .firestore()
    .collection("employees")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var newRow = table.insertRow(table.length);
        newRow.setAttribute("data-table-id", doc.id);
        cell1 = newRow.insertCell(0);
        cell1.innerHTML = doc.data().fullName;
        cell2 = newRow.insertCell(1);
        cell2.innerHTML = doc.data().email;
        cell3 = newRow.insertCell(2);
        cell3.innerHTML = doc.data().phonenumber;
        cell4 = newRow.insertCell(3);
        cell4.innerHTML = doc.data().dateofbirth;
        cell5 = newRow.insertCell(4);
        cell5.innerHTML = doc.data().salary;
        cell5 = newRow.insertCell(5);
        cell5.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                           <a onClick="onDelete(this)">Delete</a>`;
      });
    });
}
