const togglePasswordVisibility = (type: any) => {
    if (type === 'password') {
        setPasswordVisible(!passwordVisible);
    } else {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    }
};