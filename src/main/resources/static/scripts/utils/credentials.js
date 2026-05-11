export function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

export function checkImageFile(file) {
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    if (!ALLOWED_TYPES.includes(file.type)) {
        return {isValid: false, message: "Only JPG, PNG, or WEBP images are allowed."};
    }

    if (file.size > MAX_SIZE) {
        return {isValid: false, message: "Image must be less than 2MB."};
    }

    return {isValid: true, message: ""};
}

export function validateAccountInfo(newUsername, newEmail, oldUsername, oldEmail) {
    let result = {isValid: true, errorMessage: ""};

    if (newUsername === oldUsername && newEmail === oldEmail) {
        result.errorMessage = "No changes were made.";
        result.isValid = false;
    } else if (newUsername.length < 5) {
        result.errorMessage = "Username must have at least 5 characters.";
        result.isValid = false;
    } else if (newUsername.length > 30) {
        result.errorMessage = "Username must not exceed 30 characters.";
        result.isValid = false;
    } else if (!isValidEmail(newEmail)) {
        result.errorMessage = "Invalid email.";
        result.isValid = false;
    }

    return result;
}

export function validatePassword(password, confirmPassword) {
    let result = {isValid: true, errorMessage: ""};

    if (password.length < 6) {
        result.errorMessage = "Password must have at least 6 characters.";
        result.isValid = false;
    } else if (password !== confirmPassword) {
        result.errorMessage = "Passwords do not match.";
        result.isValid = false;
    }

    return result;
}


export function validateProfileData(newDescription, oldDescription, newProfilePicture, oldProfilePicture) {
    let result = {isValid: true, errorMessage: ""};
    if (newDescription === oldDescription && newProfilePicture === oldProfilePicture) {
        result.errorMessage = "No changes were made.";
        result.isValid = false;
    } else if (newDescription != null && newDescription.length > 500) {
        result.errorMessage = "Description must not exceed 500 characters.";
        result.isValid = false;
    }

    return result;
}