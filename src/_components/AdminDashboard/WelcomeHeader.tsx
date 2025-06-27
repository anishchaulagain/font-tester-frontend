import { useEffect, useState } from "react";



const WelcomeHeader = () => {
    const [firstName, setFirstName] = useState<string>('')
    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            const user = JSON.parse(savedUser);
            setFirstName(user.firstName)
        }
    }, []);


    return (
         <div className="mb-2">
            <span className="text-lg dark:text-white text-black   ">
              Welcome back, <span className="font-bold">{firstName || 'Admin'}</span>
            </span>
          </div>
    )
}

export default WelcomeHeader