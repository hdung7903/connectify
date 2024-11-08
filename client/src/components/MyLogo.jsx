import { Link } from 'react-router-dom';
import Connectify from '../assets/connectify.svg';
import { useAuth } from '../contexts/AuthContext';

const MyLogo = () => {
    const {isAuthenticated} = useAuth();
    return (
        <Link to={isAuthenticated ? '/home' : '/'}>
            <img src={Connectify} alt="My SVG Logo" style={{ width: '50px', height: '50px' }} />
        </Link>
    )
}

export default MyLogo;