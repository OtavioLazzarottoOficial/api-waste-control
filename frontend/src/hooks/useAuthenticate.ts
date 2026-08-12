import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";
import type { Authenticate } from "../models/authenticate.model";
import { useAuth } from "../contexts/auth-context";
import { translateError } from "../helpers/translateError";

async function auth(data: Authenticate): Promise<string> {
  const response = await api.post("/sessions", data);
  return response.data.access_token;
}

export function useAuthenticate() {
  const { login } = useAuth();

  return useMutation<string, AxiosError<{ message?: string; error?: string }>, Authenticate>({
    mutationFn: auth,
    onSuccess: (access_token) => {
      login(access_token); // contexto cuida do resto
      notifySuccess("Login realizado com sucesso.");
    },
    onError: (error) => {
      console.error("Erro ao autenticar:", error?.message);
      // try to extract backend message when available
      const backendMsg = error?.response?.data;
      const message = backendMsg?.message || backendMsg?.error || error?.message || "Erro ao autenticar.";
      notifyError(translateError(String(message)));
    },
  });
}