const URL = import.meta.env.VITE_BACKEND_URL;

const sendContactMessage = async ({ firstName, lastName, email, title, message, captcha }) => {
  try {
    const response = await fetch(`${URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, title, message, captcha }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Something went wrong" };
    }
    return data;
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};

export { sendContactMessage };
