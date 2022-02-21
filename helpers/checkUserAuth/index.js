const checkUserAuth = (token, email_user) => {
    if (!token && !email_user) return false

    return true
}

export default checkUserAuth