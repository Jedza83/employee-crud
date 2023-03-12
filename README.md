Setup Guide

      To set up and run the employee management app, follow these steps:

Clone the repository containing the app to your local machine.
Open the repository in your preferred code editor.
Access to the app from index.html by opening with the Live server.
Try other functionalities by moving through the horizontal navigation bar at the top.

     Folder Structure Overview

     The employee management app follows a simple folder structure to organize HTML,
     CSS, and JavaScript files. Here's an overview of the folder structure:

1.index.html: The main HTML file includes a navigation bar, then a form for entering data about the employee's name, email, phone number, date of birth, and monthly salary, as well as a table about the entered data and links to the necessary CSS, JavaScript file and Firebase.
2.style.css: The main CSS file for the app, which defines the styles for various elements in the app.
3.img: A folder containing an image used in the app as the background image.
4.pages: A folder containing HTML files for each page of the app, including the tasks page, vacation page, chart page, and the "top five" page.
5.tasks.html includes a navigation bar, then a form for entering data about the title of the task, description, assignee, and due date, as well as a table about the entered data and links to the necessary CSS, JavaScript file, and Firebase.
6.vacation.html includes a navigation bar, then a form for entering data about the employee's name, vacation start date, and vacation end date, as well as a table about the entered data and links to the necessary CSS, JavaScript file, and Firebase. Below the navigation bar, there is a button that activates the functionality for obtaining data about which of the employees from the table goes on vacation first.
7.five.html includes a navigation bar, a button that activates the functionality for displaying five employees who completed the largest number of tasks in the past month, and links to the necessary CSS, JavaScript file, and Firebase.
8.chart.html includes a navigation bar, a JS google chart about three ranges of salaries, and links to the necessary CSS, JavaScript file, and Firebase.
9.scripts: A folder containing JavaScript files for each page of the app, including the employees.js, tasks.js, vacation.js, chart.js, and five.js files. Each JavaScript file includes the code necessary to implement the functionality for its corresponding page.
10.employees.js includes Create, Read, Update, and Delete functionalities for employees' data. The data entered through the form on the page, by clicking on submit, is printed in the table below the form and stored in the Firebase. Data about employees can be changed and deleted by clicking on edit or delete in the table row for a specific employee. Every change in the database is also visible in the table.
11.tasks.js includes Create, Read, Update, and Delete functionalities for task data. The data entered through the form on the page, by clicking on submit, is printed in the table below the form and stored in the Firebase. Data about tasks can be changed and deleted by clicking on edit or delete in the table row for a specific task. Every change in the database is also visible in the table.
12.vacation.js file includes Create, Read, Update, and Delete functionalities for vacation data. The data entered through the form on the page, by clicking on submit, is printed in the table below the form and stored in the Firebase. Data about vacation can be changed and deleted by clicking on edit or delete in the table row for specific vacation data. Every change in the database is also visible in the table. This file also includes the closestHoliday function, which calculates which employee goes on vacation first, so that if the company has a lot of employees, his superior will get to know the unfinished tasks before the employee goes on vacation, and take measures for a better organization of the replacement of the employee. This function compares the current date and vacation start date of all employees.
13.chart.js file includes a function to show a chart for 3 salary ranges { min: 0, max: 1000 }, { min: 1001, max: 2000 }, { min: 2001, max: 3000 }, in percentages.
14.five.js file includes the function topFive which counts the tasks of employees from the previous month, sorts and prints the 5 names of employees with the largest number of completed tasks.
