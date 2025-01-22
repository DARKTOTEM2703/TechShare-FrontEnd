import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faFacebook, faXTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function SocialIcons() {
    return (
        <div className="flex space-x-4 min-w-28">
            <a href="https://github.com/aaaimx" >
                <FontAwesomeIcon icon={faGithub} className="text-white text h-5 w-5" />
            </a>
            <a href="https://www.facebook.com/aaaimx">
                <FontAwesomeIcon icon={faFacebook} className="text-white text h-5 w-5" />
            </a>
            <a href="https://twitter.com/aaaimxc">
                <FontAwesomeIcon icon={faXTwitter} className="text-white text h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/aaaimx/">
                <FontAwesomeIcon icon={faInstagram} className="text-white text h-5 w-5" />
            </a>
        </div>
    );
}
