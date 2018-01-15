// data array to store full listing
var userListData = [];

// init listing on DOM ready
$(document).ready(function () {
    // call listing function
    showUserList();

    // trigger: Username link click event
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // trigger: Add User button click event
    $('#btnAddUser').on('click', saveNewUser);

    // trigger: Delete User link click event
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', saveDeleteUser);
});

// Retrieve and show User listing data
var showUserList = function () {
    var tableContentStr = '';

    // jQuery AJAX call for JSON
    $.getJSON('/users/list', function (data) {
        userListData = data;
        
        $.each(data, function () {
            tableContentStr += '<tr>';
            tableContentStr += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContentStr += '<td>' + this.email + '</td>';
            tableContentStr += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">Delete</a></td>';
            tableContentStr += '</tr>';
        });

        $('#userList table tbody').html(tableContentStr);
    });
};

// Show User detail info
var showUserInfo = function(event) {
    // prevent link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribue
    var username = $(this).attr('rel');

    // Get index of object based on username value
    var arrayIndex = userListData.map(
        function(item) { 
            return item.username; 
        }
    ).indexOf(username);

    // Get User object based on the array index returned
    var user = userListData[arrayIndex];

    // Populate the Info Box
    $('#userInfoName').text(user.fullname);
    $('#userInfoAge').text(user.age);
    $('#userInfoGender').text(user.gender);
    $('#userInfoLocation').text(user.location);
};

// Save New User
var saveNewUser = function(event) {
    event.preventDefault();

    // basic validation
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });

    if (errorCount > 0) {
        alert('Please fill in all fields.');
        return false;
    } else {
        // compile all user info into 1 user object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        };

        // use AJAX to POST the object to the addUser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/add',
            dataType: 'JSON'
        }).done(function(res) {
            // check for successful (blank) response
            if (res.msg === '') {
                // clear the form input
                $('#addUser fieldset input').val('');

                // Refresh the listing table
                showUserList();
            } else {
                // Alert error message if any
                alert('Error: ' + res.msg);
            }
        });
    }
};

// Save Delete User
var saveDeleteUser = function(event) {
    event.preventDefault();

    // Pop-up a Confirmation dialog
    if (confirm('Proceed to delete the selected User?')) {
        $.ajax({
            type: 'DELETE',
            url: '/users/delete/' + $(this).attr('rel')
        }).done(function(res) {
            // check for successful (blank) response
            if (res.msg === '') {
                // Refresh the listing table
                showUserList();
            } else {
                // Alert error message if any
                alert('Error: ' + res.msg);
            }
        });
    } else {
        return false;
    }
};
