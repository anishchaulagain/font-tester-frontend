import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

import { useNavigate } from "react-router-dom";


const LogoutComponent = () => {
    const {logout} = useAuth();
    const navigate = useNavigate()
    const handleLogout = () =>{
        logout();
        navigate('/')
    }
  return (
    <Button className="cursor-pointer" onClick={handleLogout} variant={"outline"}>Logout</Button>
  )
}

export default LogoutComponent