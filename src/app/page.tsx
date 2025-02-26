import AuthForm from '../components/AuthForm'

export default async function SignIn() {
  return (
    <div>
      <h1 className="absolute w-full py-5 text-center text-lg font-medium">Auth with Next.js and API RESTFUL (Node.js)</h1>
      <AuthForm />
    </div>
  );
}
