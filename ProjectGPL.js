// Function to get the current user ID (replace with your actual user authentication logic)
 function getCurrentUserID() {
    // Example: Retrieve user ID from a user authentication system
    
    return document.getElementById('User').value;
}


// Retrieve the stored files from localStorage on page load
var isNewUser = false;
var currentUserId = getCurrentUserID();
var permanentFiles = JSON.parse(localStorage.getItem('permanentFiles_'+ currentUserId)) || {};
var tempSelectedFiles = JSON.parse(localStorage.getItem('permanentFiles_'+ currentUserId)) || {};
var attemptCount = 1;

//constant variables
const MAX_ATTEMPT_COUNT = 5;

function LoadImage(imageIndex) {
    var nIndex = 'index' + imageIndex;

    // Create a file input element dynamically
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // Allow only image files
    fileInput.style.display = 'none'; // Hide the input


    // Create a button to trigger the file input dialog
    var button = document.createElement('button');
    button.innerText = 'Select Image';
    button.addEventListener('click', function () {
        fileInput.click();
    });

    // Append the file input to the body or any other suitable container
    document.body.appendChild(fileInput);
    document.body.appendChild(button);

    // Trigger the file input dialog
    fileInput.click();

    // Handle the file selection
    fileInput.addEventListener('change', function () {
        var selectedFile = fileInput.files[0];

        if (selectedFile) {
            // Assuming you have an img element with id='index1'
            var imgElement = document.getElementById(nIndex);

            // Create a FileReader to read the selected file
            var reader = new FileReader();
            reader.onload = function (e) {

                // Set the source of the img element to the selected image
                imgElement.src = e.target.result;
                   
                // Store the selected file in the object
                tempSelectedFiles[imageIndex] = {
                    filename: selectedFile.name,
                    dataURL: e.target.result,
                }
            }

            // Read the selected file as a data URL
            reader.readAsDataURL(selectedFile);
        }

        /*
        // Rest of your code for handling image source based on imageIndex
        var pic;
        if (imageIndex == 1) {
            pic = "C:\\Temp\\Visual Password\\Image Library\\MyPhoto_Small_1.png";
        } else if (imageIndex == 2) {
            pic = "C:\\Temp\\Visual Password\\Image Library\\MyPhoto_Small_2.png";
        } else if (imageIndex == 3) {
            pic = "C:\\Temp\\Visual Password\\Image Library\\MyPhoto_Small_3.png";
        } else {
            pic = "C:\\Temp\\Visual Password\\Image Library\\Image_pwd.png";
        }
        document.getElementById(nIndex).src = pic;*/

        // Remove the file input from the DOM after handling
        document.body.removeChild(fileInput);
        document.body.removeChild(button);
    });
}

// Function to get the user ID from the localStorage key
function getUserIdFromKey(key) {
    // Example: Extract the user ID from the key (assuming the key format is 'permanentFiles_user123')
    var userIdMatch = key.match(/permanentFiles_(.+)/);
    return userIdMatch ? userIdMatch[1] : null;
}

// Function to get the user ID from the localStorage key
function IsUserExists() {
    // Example: Extract the user ID from the key (assuming the key format is 'permanentFiles_user123')
    var currentUserId = getCurrentUserID();
    return localStorage.getItem('permanentFiles_' + currentUserId)
}

function readUserData() {
    // Retrieve all keys from localStorage
    var allKeys = Object.keys(localStorage);

    // Iterate through keys to find those related to permanentFiles
    for (var i = 0; i < allKeys.length; i++) {
        var key = allKeys[i];

        // Check if the key is related to permanentFiles
        if (key.startsWith('permanentFiles_')) {
            var userId = getUserIdFromKey(key);
            var currentUser = getCurrentUserID();
            console.log('User ID:', userId);

            if(userId == currentUser)
            {
                // Retrieve the stored files from localStorage for the current user
                permanentFiles = JSON.parse(localStorage.getItem(key)) || {};
                break;
            }

            // ... (rest of your code)
        }
    }
}

/*
// Iterate through the keys of selectedFiles
for (var key in permanentFiles) {
    if (selectedFiles.hasOwnProperty(key)) {
        console.log('Index:', key);
        console.log('Filename:', selectedFiles[key].filename);
        console.log('Data URL:', selectedFiles[key].dataURL);
    }
}
*/

function newLogin() {
    isNewUser = true;
    ConfirmLogin();

}

function ConfirmLogin() {
    isNewUser = false;

    // Store the permanentFiles object for the current user
    var currentUserId = getCurrentUserID();

    // Create a new permanent instance and copy the values from tempSelectedFiles
    for (var key in tempSelectedFiles) {
        if (tempSelectedFiles.hasOwnProperty(key)) {
           if(IsUserExists()){
                alert('User already exists, cannot change the password')
                break;
            }
            else{
                //copy each image
                permanentFiles[key] = { ...tempSelectedFiles[key] };
            }
        }
    }

    if(!IsUserExists()){
        // Store the new permanent instance in localStorage or send it to the server
        localStorage.setItem('permanentFiles_' + currentUserId, JSON.stringify(permanentFiles));
        alert('Login Successful!')
        window.location.href = "https://cyberlabs.club/";
    }
}

function CompareExistingLogin(){
    //get correct graphical password order from the localstorage for the login user
    var currentUserId = getCurrentUserID();
    var permanentFilesForExistingUser = {};
    try {
           readUserData();
            console.log(permanentFiles);
        } catch (error) {
            console.error('Error retrieving user data:', error);
        }
        compareSelectedFiles(tempSelectedFiles, permanentFiles);
}

function compareSelectedFiles(files1, files2) {
    var isMatch = true;

    var files1Count = Object.keys(files1).length;
    var files2Count = Object.keys(files2).length;

    

    if(attemptCount > 4) {
        alert('You have exceeded maxmimum 4 attempts. Your account has been locked out, please try after 30 minutes');
        attemptCount = 1;
        return 0;
    }

  

    if(files1Count!== files2Count)
    {
        attemptCount = attemptCount + 1;
        isMatch = false;
        alert('Invalid Graphical Password or Sequence, '+ 'Attempt left:' + (MAX_ATTEMPT_COUNT - attemptCount));
    }

    // Iterate through the keys of files1
    for (var key in files1) {
        if (files1.hasOwnProperty(key)) {
            // Check if the key exists in files2
            if (key in files2) {
                // Compare values for each index
                if (files1[key].filename !== files2[key].filename ||
                    files1[key].dataURL !== files2[key].dataURL) {
                        attemptCount = attemptCount + 1;
                        isMatch = false;
                        alert('Invalid Graphical Password or Sequence, '+ 'Attempt left:' + (MAX_ATTEMPT_COUNT - attemptCount));
                        key = null;
                        break;
                }
            }
        }
    }

    if(isMatch)
    {  
        alert('Login Successful again !!!'); 
        window.location.href = "https://cyberlabs.club/";
        
    }

} 

function getPermanentFilesForAUser() {
    // Access the permanentFiles object for the current user
    var currentUserId = getCurrentUserID();
    return JSON.parse(localStorage.getItem('permanentFiles_' + currentUserId)) || {};
}
