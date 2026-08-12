import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button/button";
import { Input } from "../components/input/input";
import { usePostUser } from "../hooks/usePostUser";
import { useZodForm } from "../hooks/useZodForm";
import {
  userFormZodSchema,
  type UserFormZodSchema,
  Roles,
} from "../schemas/userFormZodSchema";
import { Select } from "../components/select/select";

type SignUpForm = UserFormZodSchema;

function SignUp() {
  const navigate = useNavigate();
  const { mutate: createUser, isPending } = usePostUser();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useZodForm(userFormZodSchema);

  const handleSignUp: SubmitHandler<SignUpForm> = (data) => {
    createUser(data, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };

  return (
    <div className="flex flex-col items-center px-4 sm:px-12 lg:px-24 pt-10 sm:pt-14">
      <h2 className="text-2xl font-bold mb-4">Cadastro de Usuário</h2>

      <div className="flex flex-col w-full max-w-lg gap-4">
        <div className=" bg-white/50 rounded-xl shadow-md p-6">
          <h3 className="text-md mb-2">Adicionar novo usuário</h3>
          <p className="text-sm text-slate-500 mb-6">
            Preencha os dados abaixo para criar um usuário capaz de acessar o
            painel.
          </p>

          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(handleSignUp)}
          >
            <Input
              label="Nome"
              type="text"
              placeholder="Nome completo"
              {...register("name")}
              error={errors.name?.message}
              disabled={isPending}
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              error={errors.email?.message}
              disabled={isPending}
            />

            <Select
              label="Tipo"
              options={[
                { value: "", label: "Selecione uma das opçoes" },
                { value: Roles.EMPLOYEE, label: "Usuário" },
                { value: Roles.ADMIN, label: "Administrador" },
              ]}
              {...register("roles")}
              error={errors.roles?.message}
              disabled={isPending}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="******"
              {...register("password")}
              error={errors.password?.message}
              disabled={isPending}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" disabled={isPending} isLoading={isPending}>
                {isPending ? "Cadastrando..." : "Cadastrar"}
              </Button>
              <Button
                type="button"
                color="bg-slate-200"
                className="text-slate-900 hover:bg-slate-300"
                onClick={() => navigate("/dashboard")}
                disabled={isPending}
              >
                Voltar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
