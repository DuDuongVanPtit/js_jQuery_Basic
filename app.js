$(document).ready(function() {
    var studentApi = "http://localhost:3000/students";
    function start(){
        getStudents(renderStudents);
        handleCreateForm();
    }
    start();

    function getStudents(callback){
        fetch(studentApi)
            .then(function(response){
                return response.json();
            })
            .then(callback);
    }

    function createStudent(data, callback){
        var obtions = {
            method: 'POST', 
            body: JSON.stringify(data)
        };
        fetch(studentApi, obtions)
            .then(function(response){
                return response.json();
            })
            .then(callback);
    }

    $('#deleteButton').click(function() {
        var selectedCheckboxes = $('#studentTable tbody input[type="checkbox"]:checked');
        var selectedIds = [];
        selectedCheckboxes.each(function() {
            var selectedRow = $(this).closest('tr');
            var studentId = selectedRow.data('studentid');
            selectedIds.push(studentId);
        });
        deleteStudents(selectedIds);
    });
    function deleteStudents(ids){
        ids.forEach(id =>{
            console.log(id);
            var obtions = {
                method: 'DELETE', 
            };
            fetch(studentApi +"/"+ id, obtions)
                .then(function(response){
                    response.json();
                    console.log(response);
                })
        });
    }

    $('#editButton').click(function() {
        var selectedCheckboxes = $('#studentTable tbody input[type="checkbox"]:checked');
        var selectedIds = [];
        selectedCheckboxes.each(function() {
            var selectedRow = $(this).closest('tr');
            var studentId = selectedRow.data('studentid');
            selectedIds.push(studentId);
        });
        if(selectedIds.length == 1){
            var selectedRow = selectedCheckboxes.closest('tr');
            var studentId = selectedRow.find('td:eq(0)').text();
            var studentName = selectedRow.find('td:eq(1)').text();
            var studentBirthday = selectedRow.find('td:eq(2)').text();
            var studentMobile = selectedRow.find('td:eq(3)').text();
            var studentHometown = selectedRow.find('td:eq(4)').text();
            $('#id').val(studentId);
            $('#name').val(studentName);
            $('#birthday').val(studentBirthday);
            $('#mobile').val(studentMobile);
            $('#hometown').val(studentHometown);
            $('#create-btn').attr('id', 'edit-btn').text('Edit Student');
        }
        else alert("Bạn chỉ được phép sửa một sinh viên");
        
    });
    function updateStudent(id, data){
        var editApi = studentApi + "/" + id;
        var obtions = {
            method: 'PUT', 
            body: JSON.stringify(data)
        };
        fetch(editApi, obtions)
            .then(response => {
                if (!response.ok) {
                    alert('Failed to update student');
                }
                return response.json();
            })
            .then(data => {
                alert('Student updated successfully:');
            })
            .catch(error => {
                alert('Error updating student');
            });
    }

    function renderStudents(students){
        var studentList = document.querySelector('#renderStudent');
        var htmls = students.map(function(student){
            return `
                <tr data-studentId="${student.id}">
                    <td hidden>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.birthday}</td>
                    <td>${student.mobile}</td>
                    <td>${student.hometown}</td>
                    <td><input type="checkbox"></td>
                </tr>
            `;
        });
        studentList.innerHTML = htmls.join('');
    }

    function handleCreateForm(){
        var createBtn = document.querySelector('#create-btn');
        createBtn.onclick = function(){
            var code = document.querySelector('input[name = "id"]').value;
            var name = document.querySelector('input[name = "name"]').value;
            var dateOfBirth = document.querySelector('input[name = "birthday"]').value;
            var phoneNumber = document.querySelector('input[name = "mobile"]').value;
            var hometown = document.querySelector('input[name = "hometown"]').value;

            var data = {
                code: code,
                name: name, 
                birthday: dateOfBirth, 
                mobile: phoneNumber,
                hometown: hometown

            }
            if(code == null || code === ''){
                createStudent(data);
            }
            else updateStudent(code, data);
        }
    }

    $('#studentTable').on('change', 'input[type="checkbox"]', function() {
        var anyChecked = $('#studentTable tbody input[type="checkbox"]:checked').length > 0;
        $('#editButton, #deleteButton').prop('disabled', !anyChecked);
    });

});