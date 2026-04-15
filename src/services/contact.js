const URL = import.meta.env.VITE_BACKEND_URL;

const sendContactMessage = async ({ firstName, lastName, email, category, title, message, captcha, token }) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${URL}/api/contact`, {
      method: "POST",
      headers,
      body: JSON.stringify({ firstName, lastName, email, category, title, message, captcha }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Something went wrong" };
    }
    return data;
  } catch (error) {
    console.log(error.message)
    return { error: error.message || "Something went wrong" };
  }
};

export { sendContactMessage };
