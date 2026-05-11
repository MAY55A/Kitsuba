import {changePassword, deleteUser, fetchUserData, updateUserData, updateUsernameAndEmail} from "../api/userApi.js";
import {loadAuthNav} from "../ui/authNav.js";
import {validateAccountInfo, validatePassword, validateProfileData} from "../utils/credentials.js";

const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const accountBtn = document.getElementById("submit-account");
const accountError = document.getElementById("account-error");
const accountSuccess = document.getElementById("account-success");

const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const passwordBtn = document.getElementById("submit-password");
const passwordError = document.getElementById("password-error");
const passwordSuccess = document.getElementById("password-success");

const descriptionInput = document.getElementById("description");
//const fileInput = document.getElementById('profile-image');
//const uploadBtn = document.getElementById('upload-btn');
//const fileName = document.getElementById('file-name');
const currentImage = document.getElementById('current-image');
const avatarRadios = document.querySelectorAll('input[name="avatar"]');
//const removeBtn = document.getElementById('remove-image');
const profileBtn = document.getElementById("submit-profile");
const profileError = document.getElementById("profile-error");
const profileSuccess = document.getElementById("profile-success");

const alertBtn = document.getElementById("alert-btn");
const deleteBtn = document.getElementById("delete-btn");
const cancelBtn = document.getElementById("cancel-btn")


const defaultProfileImage = "/images/avatars/default_avatar.png";
//let selectedFile = null;
let userData;

function onAccountInfoChange() {
    const username = usernameInput.value;
    const email = emailInput.value;

    accountBtn.disabled = username === null || username.length === 0 || email === null || email.length === 0;
}

function onPasswordsChange() {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    passwordBtn.disabled = newPassword === null || newPassword.length === 0 || confirmPassword === null || confirmPassword.length === 0;
}

/* Enable later...
function  onImageChange() {
    const file = fileInput.files[0];
    if (!file) {
        fileName.value = 'No file chosen';
        return;
    }

    fileName.value = file.name;
    selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage.src = e.target.result;
        currentImage.classList.remove('d-none');
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    currentImage.src = defaultProfileImage;
    fileInput.value = '';

    selectedFile = null;
    removeImageFlag = true;
}

 */

function togglePopupDisplay() {
    document.getElementById("confirmation-modal").classList.toggle("hidden");
}

async function deleteAccount() {
    deleteBtn.disabled = true;
    await deleteUser();
}

accountBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const username = usernameInput.value;
    const email = emailInput.value;

    accountSuccess.classList.add("hidden");
    accountError.textContent = "";
    accountBtn.disabled = true;
    accountBtn.textContent = "Saving...";

    let result = validateAccountInfo(username, email, userData.username, userData.email);
    if (result.isValid) {
        try {
            let response = await updateUsernameAndEmail({username, email});
            if (response.ok) {
                accountSuccess.classList.remove("hidden");
                userData.username = username;
                userData.email = email;
                setTimeout(() => {
                    accountSuccess.classList.add("hidden");
                }, 5000)
            } else {
                accountError.textContent = await response.text();
            }
        } catch (err) {
            accountError.textContent = "An error happened while updating your account.";
            console.error(err);
            accountBtn.disabled = false;
        }
    } else {
        accountError.textContent = result.errorMessage.length > 50
            ? "An error happened while updating your account." : result.errorMessage;
        accountBtn.disabled = false;
    }
    accountBtn.textContent = "Save changes";
});
passwordBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    passwordSuccess.classList.add("hidden");
    passwordError.textContent = "";
    passwordBtn.disabled = true;
    passwordBtn.textContent = "Saving...";

    let result = validatePassword(newPassword, confirmPassword);
    if (result.isValid) {
        try {
            let response = await changePassword(newPassword);
            if (response.ok) {
                passwordSuccess.classList.remove("hidden");
                setTimeout(() => {
                    passwordSuccess.classList.add("hidden");
                }, 5000)
            } else {
                passwordError.textContent = await response.text();
            }
        } catch (err) {
            passwordError.textContent = "An error happened while changing your password.";
            console.error(err);
            passwordBtn.disabled = false;
        }
    } else {
        passwordError.textContent = result.errorMessage.length > 50
            ? "An error happened while changing your password." : result.errorMessage;
        passwordBtn.disabled = false;
    }
    passwordBtn.textContent = "Save changes";
});
profileBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const description = descriptionInput.value;
    const profilePicture = currentImage.src;

    profileSuccess.classList.add("hidden");
    profileError.textContent = "";
    profileBtn.disabled = true;
    profileBtn.textContent = "Saving...";

    let result = validateProfileData(description, userData.description, profilePicture, userData.profilePicture);
    if (result.isValid) {
        try {
            let response = await updateUserData({description, profilePicture});
            if (response.ok) {
                profileSuccess.classList.remove("hidden");
                userData.description = description;
                userData.profilePicture = profilePicture;
                setTimeout(() => {
                    profileSuccess.classList.add("hidden");
                }, 5000)
            } else {
                profileError.textContent = await response.text();
            }
        } catch (err) {
            profileError.textContent = "An error happened while updating your profile.";
            console.error(err);
        }
    } else {
        profileError.textContent = result.errorMessage.length > 50
            ? "An error happened while updating your profile." : result.errorMessage;
    }
    profileBtn.textContent = "Save changes";
    profileBtn.disabled = false;
});
alertBtn.addEventListener("click", togglePopupDisplay);
cancelBtn.addEventListener("click", togglePopupDisplay);
deleteBtn.addEventListener("click", deleteAccount)


usernameInput.addEventListener("input", onAccountInfoChange);
emailInput.addEventListener("input", onAccountInfoChange);
newPasswordInput.addEventListener("input", onPasswordsChange);
confirmPasswordInput.addEventListener("input", onPasswordsChange);


fetchUserData().then((user) => {
    loadAuthNav(user);
    userData = user

    usernameInput.value = userData.username;
    emailInput.value = userData.email;
    descriptionInput.value = userData.description;
    currentImage.src = userData.profilePicture ? userData.profilePicture : defaultProfileImage;

    avatarRadios.forEach(radio => {
        if (currentImage.src.endsWith(radio.value)) {
            radio.checked = true;
        }
        radio.addEventListener('change', () => {
            if (radio.checked) {
                currentImage.src = `/images/avatars/${radio.value}`;
            }
        });
    });

    /* Add later: image input for PREMIUM users
        if (user.accountType === "PREMIUM") {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });
            fileInput.addEventListener('change', onImageChange);
        }

     */
})