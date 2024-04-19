// Biến để lưu trữ ID của sinh viên đang được sửa
var editingStudentId = null;

$(document).ready(function() {
    // Load students from JSON file
    $.getJSON('students.json', function(data) {
        $.each(data, function(index, student) {
            addStudentToTable(student);
        });
    });

    // Add new student or update existing student
    $('#studentForm').submit(function(event) {
        event.preventDefault();
        var formData = $(this).serializeArray();
        var student = {};
        $.each(formData, function(index, field) {
            student[field.name] = field.value;
        });

        if (editingStudentId) {
            // Update existing student
            updateStudentInTable(student, editingStudentId);
            editingStudentId = null; // Reset editingStudentId
        } else {
            // Add new student
            addStudentToTable(student);
        }

        $(this)[0].reset();
    });

    $('#deleteButton').click(function() {
        $('#studentTable tbody input[type="checkbox"]:checked').closest('tr').remove();
    });

    $('#studentTable').on('change', 'input[type="checkbox"]', function() {
        var anyChecked = $('#studentTable tbody input[type="checkbox"]:checked').length > 0;
        $('#editButton, #deleteButton').prop('disabled', !anyChecked);
    });

    // Edit student
    $('#studentTable').on('click', '.editButton', function() {
        var selectedRow = $(this).closest('tr');
        var studentId = selectedRow.data('student-id');
        var studentName = selectedRow.find('td:eq(0)').text();
        var studentBirthday = selectedRow.find('td:eq(1)').text();
        var studentMobile = selectedRow.find('td:eq(2)').text();
        var studentHometown = selectedRow.find('td:eq(3)').text();

        // Populate form fields with student data
        $('#name').val(studentName);
        $('#birthday').val(studentBirthday);
        $('#mobile').val(studentMobile);
        $('#hometown').val(studentHometown);

        // Set editingStudentId to the ID of the student being edited
        editingStudentId = studentId;
    });

    // Function to add a student to the table
    function addStudentToTable(student) {
        var row = $('<tr>');
        row.append('<td>' + student.name + '</td>');
        row.append('<td>' + student.name + '</td>');
        row.append('<td>' + student.birthday + '</td>');
        row.append('<td>' + student.mobile + '</td>');
        row.append('<td>' + student.hometown + '</td>');
        row.append('<td><button class="editButton">Edit</button></td>'); // Change to class
        row.append('</tr>');
        row.data('student-id', generateUniqueId()); // Generate and set a unique ID for the student
        $('#studentTable tbody').append(row);
        
    }
    

    // Function to update an existing student in the table
    function updateStudentInTable(student, studentId) {
        var row = $('#studentTable tbody tr[data-student-id="' + studentId + '"]');
        row.find('td:eq(0)').text(student.name);
        row.find('td:eq(1)').text(student.birthday);
        row.find('td:eq(2)').text(student.mobile);
        row.find('td:eq(3)').text(student.hometown);
    }

    var studentCount = 0;
    function generateUniqueId() {
        studentCount++;
        return studentCount;
    }
});
