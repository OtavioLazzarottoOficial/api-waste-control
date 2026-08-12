import type { SubmitHandler } from "react-hook-form";
import { Button } from "../components/button/button";
import { Input } from "../components/input/input";
import type { Authenticate } from "../models/authenticate.model";
import { useAuthenticateFormSchema } from "../schemas/authenticateFormZodSchema";
import { useAuthenticate } from "../hooks/useAuthenticate";

function Login() {
  const { handleSubmit, register, formState: { errors } } = useAuthenticateFormSchema();
  const { mutate: authenticate, isPending } = useAuthenticate();

  const handleLogin: SubmitHandler<Authenticate> = (data) => {
    authenticate(data);
  };

  return (
    <div className="w-full justify-end h-screen flex bg-amber-800">
      <div className="w-full md:w-3xl h-screen flex flex-col justify-center bg-slate-50">
        <div className="flex flex-col px-6 sm:px-16 gap-1 w-full max-w-md mx-auto md:mx-0">
          <h1 className="font-bold text-xl">Entre na sua conta</h1>
          <p className="text-sm">Insira seu e-mail e senha para acessar o painel</p>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit(handleLogin)}>
            <Input
              label="E-mail"
              type="text"
              placeholder="seu@email.com"
              {...register("email")}
              error={errors.email?.message}
              disabled={isPending}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="*******"
              {...register("password")}
              error={errors.password?.message}
              disabled={isPending}
            />

            <Button type="submit" disabled={isPending} isLoading={isPending}>
              {isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
