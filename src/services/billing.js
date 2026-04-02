const URL = import.meta.env.VITE_BACKEND_URL;

const createCheckoutSession = async (plan, userId, email, trial = false) => {
  try {
    const response = await fetch(`${URL}/api/billing/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan,
        userId,
        email,
        trial,
      }),
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

const upgradeToPro = async (userId) => {
  try {
    const response = await fetch(`${URL}/api/billing/upgrade-to-pro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
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

const continueAutoSubscription = async (userId) => {
  try {
    const response = await fetch(`${URL}/api/billing/resume-auto-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
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

const cancelAutoSubscription = async (userId) => {
  try {
    const response = await fetch(`${URL}/api/billing/cancel-auto-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
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

export {
  createCheckoutSession,
  upgradeToPro,
  continueAutoSubscription,
  cancelAutoSubscription,
};
