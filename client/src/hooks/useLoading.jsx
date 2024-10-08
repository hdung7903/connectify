import { useState } from "react";
import { useNavigate } from "react-router-dom";

function useLoading({ timeout = 500 } = {}) {

    const [spinning, setSpinning] = useState(false);
    const navigate = useNavigate();
    const handleNavigation = (path, customTimeout) => {
        setSpinning(true);
        setTimeout(() => {
            navigate(path);
            setSpinning(false);
        }, customTimeout || timeout);
    };

    return { spinning, handleNavigation };
}

export default useLoading