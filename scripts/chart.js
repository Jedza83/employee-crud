google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  // Fetch the data from firebase
  var db = firebase.firestore();
  var employeesRef = db.collection("employees");
  employeesRef.get().then(function (querySnapshot) {
    var data = new google.visualization.DataTable();
    data.addColumn("string", "Salary");
    data.addColumn("number", "Count");
    querySnapshot.forEach(function (doc) {
      var salary = doc.data().salary;
      data.addRow([salary.toString(), 1]);
    });

    // Salary ranges
    var salaryRanges = [
      { min: 0, max: 1000 },
      { min: 1001, max: 2000 },
      { min: 2001, max: 3000 },
    ];

    // Calculate the number of employees in each salary range
    var salaryRangeCounts = [];
    for (var i = 0; i < salaryRanges.length; i++) {
      var count = 0;
      for (var j = 0; j < querySnapshot.size; j++) {
        var salary = data.getValue(j, 0);
        if (salary >= salaryRanges[i].min && salary <= salaryRanges[i].max) {
          count++;
        }
      }
      salaryRangeCounts.push(count);
    }

    // Convert range to percentages
    var totalEmployees = querySnapshot.size;
    var salaryRangePercentages = [];
    for (var i = 0; i < salaryRangeCounts.length; i++) {
      var percentage = (salaryRangeCounts[i] / totalEmployees) * 100;
      salaryRangePercentages.push(percentage);
    }

    // Create the data chart
    var chartData = new google.visualization.DataTable();
    chartData.addColumn("string", "Salary Range");
    chartData.addColumn("number", "Percentage of Employees");
    for (var i = 0; i < salaryRanges.length; i++) {
      chartData.addRow([
        salaryRanges[i].min + " - " + salaryRanges[i].max,
        salaryRangePercentages[i],
      ]);
    }

    // Chart options
    var options = {
      title: "Salary Ranges",
      pieSliceText: "percentage",
      is3D: true,
    };

    // Create the chart and show it on the page
    var chart = new google.visualization.PieChart(
      document.getElementById("myChart")
    );
    chart.draw(chartData, options);
  });
}
