const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const login = async (email, password) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { error: data.error };
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.userObj));
    return data;
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};

const signup = async (firstName, lastName, email, password, recaptcha) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        password,
        email,
        recaptcha,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      if (data.error === "User already exists") {
        return { error: "User already exists" };
      } else {
        return { error: data.error || "Something went wrong" };
      }
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.userObj));
    return data;
  } catch (error) {
    console.log(error.message);
    return { error: error.message || "Something went wrong" };
  }
};

export { login, signup };
