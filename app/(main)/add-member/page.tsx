'use client';

import { useState, useEffect } from 'react';
import RegistrationForm from '@/components/member/MemberRegistrationForm';
import { Toaster } from 'sonner';
import Loading from './loading';

const Page = () => {  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if all required resources are loaded
    // In a real application, this might check if form configurations
    // or necessary data has been fetched from the server
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-10">      <Toaster 
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
          }
        }}
      />
      
      <RegistrationForm />
    </div>
  );
};

export default Page;