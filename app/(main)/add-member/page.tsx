import RegistrationForm from "@/components/member/form/MemberRegistrationForm";
import { Toaster } from "sonner";

export default async function Page() {
  return (
    <div className="container mx-auto py-10">
      {" "}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "rounded-md",
          // @ts-expect-error - sonner types are not complete
          success: {
            className: "bg-green-50 text-green-800 border-green-500",
            descriptionClassName: "text-green-700",
          },
          error: {
            className: "bg-red-50 text-red-800 border-red-500",
            descriptionClassName: "text-red-700",
          },
        }}
      />
      <RegistrationForm />
    </div>
  );
}
