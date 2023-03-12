function parseDate(dateString) {
  const [day, month, year] = dateString.split(".");
  return new Date(year, month - 1, day);
}

function topFive() {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1); // last month
  const assigneeTasks = {}; // object that counts tasks by assignee

  db.collection("tasks")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const taskDate = parseDate(doc.data().duedate);
        if (
          taskDate.getMonth() === lastMonth.getMonth() &&
          taskDate.getFullYear() === lastMonth.getFullYear()
        ) {
          // task from last month
          const assignee = doc.data().assignee;
          assigneeTasks[assignee] = (assigneeTasks[assignee] || 0) + 1; // counting tasks for assignee
        }
      });

      // sort assignee by numbers of tasks
      const topAssignees = Object.entries(assigneeTasks)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([assignee, taskCount]) => `${assignee} (${taskCount})`);

      // showing top 5 assignee
      const res = document.querySelector("#res");
      res.textContent = `Top Five employees are: ${topAssignees.join(", ")}`;
    });
}
