"use server";

import { getAuthToken } from "../utils/get-auth-cookie";

export const getAuthTokenSA = async () => getAuthToken();
