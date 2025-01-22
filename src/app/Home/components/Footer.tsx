// components/Footer/Footer.tsx
import SocialIcons from "./SocialIcons";

export default function Footer() {
    return (
        <footer className="flex justify-around align-middle gap-6 bg-primary text-white text-center py-4">
            <p className="text-sm">
                © 2025. Powered by{" "}
                <span> 
                    <a
                    className="border-b border-white" 
                    href="https://www.aaaimx.org/">@aaaimx
                    </a>
                </span>
            </p>
                <SocialIcons />   
        </footer>
    );
}
